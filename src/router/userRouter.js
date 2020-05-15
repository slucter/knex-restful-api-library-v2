const express = require('express');
const user = require('../controller/userController')
const Router = express.Router();

Router      .get('/', user.getAllUser)
            .post('/signup', user.insertUser)
            .post('/login', user.loginUser)

module.exports = Router;