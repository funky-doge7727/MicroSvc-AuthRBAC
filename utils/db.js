const mysql = require('mysql2');
const env = process.env;

console.log("env check", env);

const connection = mysql.createConnection({
    host: env.DB_HOST, 
    user: env.DB_USER,
    password: env.DB_PASS,
    database: 'appsdb'
});


// Connect to the database
connection.connect((err) => {
    if (err) throw err;

    // SQL query to insert data
    const sql = "INSERT INTO your_table_name (column1, column2) VALUES ?";
    const values = [
        ['value1', 'value2'],
        ['value3', 'value4'],
        // ... add more entries as needed
    ];

    // Execute the insert query
    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log('Number of records inserted: ' + result.affectedRows);
    });

    // Close the connection
    connection.end();
});

module.exports = connection