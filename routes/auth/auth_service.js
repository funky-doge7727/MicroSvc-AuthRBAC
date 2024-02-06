const localStrat = require('../../utils/strats/local_strat');
const logger = require('../../utils/logger');
const env = process.env

const stratMap = {local: localStrat}

const verifyStrat = (inputStrat) => {
    const authStrat = inputStrat ?? env.AUTH_STRATEGY;
    const strat = stratMap[authStrat]
    console.log(strat)
    return strat
}

module.exports = {
    registerUser: async (req, res) => {

        try {
            const strat = verifyStrat(req.body.auth_strat);
            if (!strat) 
                return logger(400, `Invalid strat specified: ${req.body.auth_strat}.`)
            const resp = strat.registerUser(req, res);
            return resp 
        } catch (err) {
            console.log(err.message)
            return {code: 500, msg: err.message}
        }
   
    },

    authenticateUser: async (req, res) => {

        try {
            try {
                const strat = verifyStrat(req.body.auth_strat);
                if (!strat) 
                    return logger(400, `Invalid strat specified: ${req.body.auth_strat}.`)
                const resp = strat.authenticateUser(req, res);
                return resp 
            } catch (err) {
                console.log(err.message)
                return {code: 500, msg: err.message}
            }

        } catch (err) {
            console.log(err)
            return {code: 500, msg: "Internal server error."}
        }

    },

    seeAllUsers: async (req, res) => {
        try {
            const strat = verifyStrat(req.body.auth_strat);
            if (!strat) 
                return logger(400, `Invalid strat specified: ${req.body.auth_strat}.`)
            const resp = strat.seeAllUsers();
            return resp 
        } catch (err) {
            console.log(err.message)
            return {code: 500, msg: err.message}
        }
    }
}

