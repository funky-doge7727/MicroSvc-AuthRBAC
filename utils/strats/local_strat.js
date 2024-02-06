const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const logger = require('../logger')
const env = process.env

module.exports = {
    registerUser: async (req, res) => {
        try {
            const { username, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 10);
            const row = await db.getrow('SELECT * FROM auth WHERE username=?', [username]);
            if (row) {
                return logger(400, `${req.body.username} already exists.`)
            }
            const appType = req.body.apptype ?? "common"
            const allowedAppTypes = await db.getvals('SELECT * FROM auth_apptype');
            if (!allowedAppTypes.includes(appType)) {
                return logger(400, `invalid apptype inserted: ${appType}.`);
            }
            await db.insert('INSERT INTO auth (username, password, apptype) VALUES (?, ?, ?)', [username, hashedPassword, appType])
            return logger(201, `${req.body.username} is registered successfully. apptype: ${appType}.`)
        } catch (err) {
            return logger(500, `${err.message}`)
        }
        
    },

    authenticateUser: async (req, res) => {
        const { username, password } = req.body

        try {
            const hashedPwFromDB = await db.getval('SELECT password FROM auth WHERE username = (?)', [username]);
            if (!hashedPwFromDB) {
                return logger(400, `User ${username} does not exist.`)
            }

            if (await bcrypt.compare(password, hashedPwFromDB)) {
                const accessToken = jwt.sign(username, env.ACCESS_TOKEN_SECRET);
                return logger(200, accessToken);
            } else {
                return logger(401, `User ${username} is unauthenticated.`);
            }


        } catch (err) {
            return logger(500, `${err.message}`)
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

