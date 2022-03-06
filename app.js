const express = require("express");
const app = express();
const path = require("path");
const config = require('config');

const sql = require('mssql')
const sqlConfig = {
    user: "sa",
    password: "123",
    database: "PriceDatabase",
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

app.use("/static", express.static(path.resolve(__dirname, "src", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname,"src", "index.html"));
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
