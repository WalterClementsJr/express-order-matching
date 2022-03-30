const mssql = require('mssql');
const mssqlConfig = require('../configs/mssql.config');

async function getDataFromDb() {
    try {
        let pool = await mssql.connect(mssqlConfig)
        return pool.request().query('SELECT * FROM BANGGIA');
    } catch (err) {
        console.log(err);
    }
}

function sendDataToSocket() {
    getDataFromDb().then(data => {
        console.log(data.recordset);
        global.io.emit("receive_data", data.recordset);
    });
}

exports.sendDataToSocket = sendDataToSocket;
