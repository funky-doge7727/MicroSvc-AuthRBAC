const mysql = require('mysql2-async').default;
const env = process.env;

const connection = new mysql({
    host: env.DB_HOST, 
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME
});

module.exports = connection