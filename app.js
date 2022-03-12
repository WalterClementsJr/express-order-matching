const express = require("express");
const app = express();
const path = require("path");

// set view engine to ejs
app.set('views', path.resolve(__dirname, "src", "views"));
app.set('view engine', 'ejs');

// set static resources path
app.use("/res", express.static(path.resolve(__dirname, "src", "static")));

// use routing in route.js
app.use(require('./src/routes/route'));

app.listen(3000, () => console.log('Server is running on localhost:3000/'));
