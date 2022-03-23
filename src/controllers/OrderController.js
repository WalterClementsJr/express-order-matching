const Order = require('../models/Order')

const {body, validationResult} = require("express-validator");

// Handle create on POST.
exports.orderCreatePost = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined')
                req.body.genre = [];
            else
                req.body.genre = new Array(req.body.genre);
        }
        next();
    },

    // Validate and sanitize fields.
    body('stockName', 'Mã cổ phiếu không hợp lệ').trim().isLength({min: 2}).escape(),

    // Process request
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            res.render('/order', {errors: errors.array()});
        } else {
            // Data from form is valid
            let order = Order.build(
                {
                    macp: req.body.stockName,
                    loaiGD: req.body.tradeOption,
                    gia: req.body.price,
                    amount: req.body.amount,
                }
            );
            order.save().then(r => {
                // Successful - TODO: redirect to somewhere.
                console.log('order saved success');
                console.log(order.toJSON());
            });
        }
    }
]
;