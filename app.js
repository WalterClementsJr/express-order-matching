const express = require("express");
const app = express();
const path = require("path");

// set view engine to ejs
app.set('views', path.resolve(__dirname, "src", "views"));
app.set('view engine', 'ejs');

// set static resources path
app.use("/res", express.static(path.resolve(__dirname, "src", "public")));

// use routing in order.js
app.use(require('./src/routes/index'));
app.use(require('./src/routes/order'));

app.listen(3000, () => console.log('Server is running on localhost:3000/'));
