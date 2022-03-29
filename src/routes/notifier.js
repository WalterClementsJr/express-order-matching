const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');

router.get('/', function (req, res) {
    if (global.isIndexPage === true) {
        // repopulate the table with ejs
        MatchController.populateTable();
    }
    res.sendStatus(200);
});

module.exports = router;
