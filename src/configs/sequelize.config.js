const Sequelize = require('sequelize');

const sequelize = new Sequelize('CHUNGKHOAN', 'sa', '123', {
    host: 'localhost',
    dialect: 'mssql',
    pool: {
        "max": 10,
        "min": 0,
        "idle": 25000,
        "acquire": 25000,
        "requestTimeout": 300000
    },
    dialectOptions: {
        encrypt: false,
        options:  {
            trustServerCertificate: true
        }
    }
});

module.exports = sequelize;