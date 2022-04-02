const {body, validationResult} = require("express-validator");
const mssql = require('mssql');
const mssqlConfig = require('../configs/mssql.config');

// Handle create on POST
orderCreatePost = [
    // Validate fields
    body('stockName', 'Mã cổ phiếu không hợp lệ').trim().isLength({min: 2}).escape(),
    // Process request
    async (req, res) => {
        // check for form errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('order', {errors: errors.array()});
        } else {
            let pool = await mssql.connect(mssqlConfig);
            pool.request()
                .input('paramMacp', mssql.NCHAR(10), req.body.stockName)
                .input('paramNgay', mssql.DATETIME, new Date().toISOString().slice(0, 19).replace('T', ' '))
                .input('paramLoaiGD', mssql.NCHAR(1), req.body.tradeOption === 'buy' ? 'M' : 'B')
                .input('paramSoLuong', mssql.Int, req.body.amount)
                .input('paramGiaDat', mssql.Float, req.body.price)
                .execute('LimitOrderMatching')
                .then(() => {
                    // Successful
                    res.render('order');
                }).catch(err => {
                console.log(err);
            });
        }
    }
];

module.exports = {orderCreatePost};