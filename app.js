const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const {body, check, validationResult} = require("express-validator");

const sql = require('mssql')
const sqlConfig = {
    user: "sa",
    password: "123",
    database: "PriceDatabase",
    server: 'localhost\\MSSQLSERVER',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

app.set('views', path.resolve(__dirname, "src", "views"));
app.set('view engine', 'ejs');

app.use("/res", express.static(path.resolve(__dirname, "src", "static")));

app.get("/*", (req, res) => {
    // res.sendFile(path.resolve(__dirname, "src", "static", "index.html"));
    res.render('index');
});

sql.connect(sqlConfig, function (err) {
    if (err) console.log(err);

    console.log("Sql running");
    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('SELECT id, name, price FROM dbo.tbl_price', function (err, recordset) {
        if (err) console.log(err)


app.post(
    '/bid',
    body('amount', 'Số lượng Không hợp lệ')
        .isInt({min: 1}),
    body('maxAmount')
        .isInt({min: 1, max: 4000}).bail()
        .custom((value, {req}) => {
            if (value < body('amount').value) {
                throw new Error('Số lượng tối đa không được bé hơn số lượng!');
            }
            return true;
        }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({errors: errors.array()});
            const alert = errors.array()
            res.render('', {
                alert
            })
        }
    },
);


app.listen(3000, () => console.log('Server is listening on port 3000'));
