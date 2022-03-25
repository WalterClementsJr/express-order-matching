const express = require('express');
const router = express.Router();
const OrderController = require("../controllers/OrderController");

router.get('/', function (req, res) {
    res.render('order');
});

router.post('/', OrderController.orderCreatePost);

module.exports = router;
