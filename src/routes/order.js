const express = require('express');
const app = express();
const router = express.Router();
const {body, check, validationResult} = require("express-validator");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let config = require('../configs/db.config').DB_CONFIG;

// order route
router.get('/order', function (req, res) {
    res.render('order');
});

router.post('/order',
    check('maxAmount', 'Số lượng max >= số lượng')
        .exists()
        .custom((value, {req}) => {
            if (value >= req.body.amount) {
                throw new Error('Password confirmation is incorrect');
            }
            return true;
        }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({errors: errors.array()});
            const alert = errors.array();
            console.log(alert);
            res.render('order', {
                alert
            });
        } else {

        }
    }
);

module.exports = router;
