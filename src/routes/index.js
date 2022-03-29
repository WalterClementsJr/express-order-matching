const express = require('express');
const router = express.Router();

// TODO: add homepage
router.get('/', function (req, res) {
    global.isIndexPage = true;
    res.render('index');
});

module.exports = router;
