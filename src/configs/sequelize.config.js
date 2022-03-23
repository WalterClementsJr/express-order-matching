const Sequelize = require('sequelize');

const sequelize = new Sequelize('CHUNGKHOAN', 'sa', '123', {
    dialect: 'mssql',
    dialectOptions: {
        encrypt: false,
        options:  {
            server: 'localhost\MSSQLSERVER',
            trustServerCertificate: true
        }
    }
});

module.exports = sequelize;