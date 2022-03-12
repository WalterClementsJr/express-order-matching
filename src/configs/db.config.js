const DB_CONFIG = {
    user: "sa",
    password: "123",
    database: "ChungKhoan",
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

module.exports = {DB_CONFIG: DB_CONFIG};