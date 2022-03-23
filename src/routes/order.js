const express = require('express');
const app = express();
const router = express.Router();
const {body, check, validationResult} = require("express-validator");
const bodyParser = require("body-parser");
const OrderController = require("../controllers/OrderController");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let config = require('../configs/db.config').DB_CONFIG;

// order route
router.get('/order', function (req, res) {
    res.render('order');
});

router.post('/order', OrderController.orderCreatePost);

module.exports = router;
