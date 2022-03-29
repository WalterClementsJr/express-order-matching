const Order = require('../models/Order');
const {body, validationResult} = require("express-validator");

// Handle create on POST
orderCreatePost = [
    () => {
        global.isIndexPage = false;
    },
// Validate fields
    body('stockName', 'Mã cổ phiếu không hợp lệ').trim().isLength({min: 2}).escape(),
    // Process request
    (req, res, next) => {
        // check for form errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('order', {errors: errors.array()});
        } else {
            let order = Order.build(
                {
                    macp: req.body.stockName,
                    loaiGD: req.body.tradeOption === 'buy' ? 'M' : 'B',
                    giaDat: req.body.price,
                    soLuong: req.body.amount,
                }
            );
            console.log(order.toJSON());
            order.save().then(() => {
                // Successful
                res.render('order');
            });
        }
    }
];

module.exports = {orderCreatePost};