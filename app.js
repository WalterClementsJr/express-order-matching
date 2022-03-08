const express = require("express");
const app = express();
const path = require("path");

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

app.use("/css", express.static(path.resolve(__dirname, "src", "static", "css")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"src", "static", "index.html"));
});

sql.connect(sqlConfig, function (err) {
    if (err) console.log(err);

    console.log("Sql running");
    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query('SELECT id, name, price FROM dbo.tbl_price', function (err, recordset) {
        if (err) console.log(err)

        // send records as a response
        // res.send(recordset);
        console.log(recordset);
    });
});

app.listen(3000, () => console.log('Server is listening on port 3000'));
