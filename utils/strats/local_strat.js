const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const logger = require('../logger')

module.exports = {
    registerUser: async (req, res) => {
        try {
            const { username, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10);
            const row = await db.getrow('SELECT * FROM auth WHERE username=?', [username]);
            if (row) {
                return logger(400, `${req.body.username} already exists.`)
            }
            await db.insert('INSERT INTO auth (username, password) VALUES (?, ?)', [username, hashedPassword])
            return logger(201, `${req.body.username} is registered successfully.`)
        } catch (err) {
            return logger(500, `${err.message}`)
        }
        
    },

    authenticateUser: async (req, res) => {
        const { username, password } = req.body

        let hashedPwFromDB = ''
        let accessToken = ''
        let msg = ''

        try {
            const sql = "SELECT password FROM auth WHERE username = ?";    
            function runQuery() {
                return new Promise((resolve, reject) => {
                    conn.query(sql, username, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result[0]) {
                        hashedPwFromDB = result[0]?.password;
                        } else {
                        msg = `User ${username} does not exist.`;
                        console.log(msg);
                        }
                        resolve();
                    }
                    });
                });
                }

            await runQuery();

            if (await bcrypt.compare(password, hashedPwFromDB)) {
                accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
            } else {
                msg = `User ${username} is unauthenticated.`
                console.log(msg)
            }

            if (accessToken) {
                return {code: 200, msg: accessToken }
            } else {
                return {code: 401, msg }
            }

        } catch (err) {
            console.log(err)
            return {code: 500, msg: "Internal server error."}
        }

    },

    seeAllUsers: async () => {

        try {
            const rows = await db.getall('SELECT * FROM auth');
            const listOfUsers = rows.map(x => x.username)
            return logger(200, listOfUsers)

        } catch (err) {
            return logger(500, `${err.message}`)
        }


    }

}

