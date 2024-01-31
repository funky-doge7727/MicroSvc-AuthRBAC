const mysql = require('mysql2');
const env = process.env;

const connection = mysql.createConnection({
    host: env.DB_HOST, 
    user: env.DB_USER,
    password: env.DB_PASS,
    database: 'appsdb'
});

module.exports = connection