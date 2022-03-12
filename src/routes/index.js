const express = require('express');
const router = express.Router();

// TODO: add homepage
router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;