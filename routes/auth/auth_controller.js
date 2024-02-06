const express = require('express');
const router = express.Router();
const authSvc = require('./auth_service')

module.exports = {
    registerUser: async (req, res) => {
        const response = await authSvc.registerUser(req, res);
        return response
    },
    authenticateUser: async (req, res) => {
        const response = await authSvc.authenticateUser(req, res);
        return response
    },
    seeAllUsers: async (req, res) => {
        const response = await authSvc.seeAllUsers(req, res);
        return response
    },

}

