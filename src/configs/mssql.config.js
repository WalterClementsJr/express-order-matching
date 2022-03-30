const MSSQL_CONFIG = {
    user: "sa",
    password: "123",
    database: "CHUNGKHOAN",
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
};

module.exports = MSSQL_CONFIG;
