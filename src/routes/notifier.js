const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/IndexController');

router.get('/', function (req, res) {
    // response to request
    res.sendStatus(200);
    // repopulate the table
    IndexController.sendLiveIndexToSocket();
});

module.exports = router;
