const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const server = require('http').Server(app);
const io = require('socket.io')(server);

const IndexController = require('./src/controllers/IndexController');

const indexRouter = require("./src/routes/index");
const orderRouter = require("./src/routes/order");
const notifyRouter = require("./src/routes/notifier");

// view engine
app.set('views', path.resolve(__dirname, "src", "views"));
app.set('view engine', 'ejs');

// static resources path
app.use("/res", express.static(path.resolve(__dirname, "src", "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routing
app.use('/notify', notifyRouter);
app.use('/order', orderRouter);
app.use('/', indexRouter);

// use io globally
global.io = io;

io.on('connection', socket => {
    console.log('New client connected');
    IndexController.sendLiveIndexToSocket();
});

server.listen(3000, () =>
    console.log('Server is running on localhost:3000/'));
