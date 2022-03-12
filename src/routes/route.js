const express = require('express');
const app = express();
const router = express.Router();

// const bodyParser = require('body-parser');
// const {body, check, validationResult} = require("express-validator");

let config = require('../configs/db.config').DB_CONFIG

// Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// TODO: add homepage
router.get('/', function (req, res) {
    res.send('About us');
});

// order route
router.get('/order', function (req, res) {
    res.render('order');
});


// app.post(
//     '/bid',
//     // body('amount', 'Số lượng không hợp lệ')
//     //     .isInt({min: 1}),
//     check('maxAmount', 'Số lượng max >= số lượng')
//         .exists()
//         .custom((value, {req}) => {
//             if (value >= req.body.amount) {
//                 throw new Error('Password confirmation is incorrect');
//             }
//             return true;
//         }),
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             // return res.status(400).json({errors: errors.array()});
//             // const alert = errors.array();
//             // console.log(alert)
//             res.render('', {
//                 alert
//             });
//         }
//     },
// );

module.exports = router;
