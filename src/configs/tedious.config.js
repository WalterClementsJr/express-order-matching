const TEDIOUS_CONFIG = {
    user: 'sa',
    password: '123',
    server: 'localhost',
    driver: 'tedious',
    database: 'CHUNGKHOAN',
    options: {
        instanceName: 'MSSQLSERVER',
        trustServerCertificate: true
    }
};

module.exports = TEDIOUS_CONFIG;