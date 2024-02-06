const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conn = require('../../utils/db');
const localStrat = require('../../utils/strats/local_strat');
const stratMap = {local: localStrat}

const env = process.env

const invalidStratSpecified = {code: 400, msg: "invalid strategy specified."}

const verifyStrat = (inputStrat) => {
    const authStrat = inputStrat ?? env.AUTH_STRATEGY;
    const strat = stratMap[authStrat]
    if (!strat) throw new Error(`Invalid strat: ${authStrat}`)
    return strat
}

module.exports = {
    registerUser: async (req, res) => {

        try {
            const strat = verifyStrat(req.body.AUTH_STRATEGY_FLAG);
            const resp = strat.registerUser(req, res);
            return resp 
        } catch (err) {
            console.log(err.message)
            return {code: 500, msg: err.message}
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

    },

    seeAllUsers: async (req, res) => {
        try {
            const strat = verifyStrat(req.body.AUTH_STRATEGY_FLAG);
            const resp = strat.seeAllUsers();
            return resp 
        } catch (err) {
            console.log(err.message)
            return {code: 500, msg: err.message}
        }
    }
}

