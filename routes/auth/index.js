const express = require('express');
const router = express.Router();
const authController = require('./auth_controller');

router.get('/ping', async (_, res) => {
    res.send('auth ping')
});

router.post('/register', async (req, res) => {

    const response = await authController.registerUser(req, res);
    return res.status(response.code).send(response);

});

router.post('/login', async (req, res) => {

    const response = await authController.authenticateUser(req, res);
    res.status(response.code).send(response);

});

router.get('/check-users', async (req, res) => {
    res.send(JSON.stringify(users))
});

module.exports = router


module.exports = router;
