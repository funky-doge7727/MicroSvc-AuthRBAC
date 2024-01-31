const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('../../utils/db');
const env = process.env

module.exports = {
    registerUser: async (req, res) => {

        try {
            switch (env.AUTH_STRATEGY) {
                case 'local':
                    const { username, password } = req.body
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const sql = "INSERT INTO auth (username, password) VALUES ?";
                    const values = [
                        [username, hashedPassword]
                    ]; 
    
                    conn.query(sql, [values], (err, result) => {
                        if (err) throw err;
                        console.log(result)
                        console.log(`User registered in ${env.AUTH_STRATEGY}: ${username}`);
                    });
                    break;
                default:
                    console.log('pass')
    
            }

            return {code: 201, msg: `${req.body.username} is registered successfully.`}
        } catch (err) {
            console.log(err)
            return {code: 500, msg: `An error occured.${req.body.username} is not registered.`}
        }


        
    },

    authenticateUser: async (req, res) => {
        const { username, password } = req.body

        let hashedPwFromDB = ''
        let accessToken = ''
        let msg = ''

        try {
            switch (env.AUTH_STRATEGY) {
                case 'local':
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

                default:
                    console.log('pass')
    
            }




        } catch (err) {
            console.log(err)
            return {code: 500, msg: "Internal server error."}
        }

    }

}

