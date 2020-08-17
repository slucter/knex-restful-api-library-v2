const express = require('express');
const user = require('../controller/userController')
const Router = express.Router();

Router      .get('/', user.getAllUser)
            .post('/signup', user.insertUser)
            .post('/login', user.loginUser)
            .post('/sendVerif', user.sendMail)
            .get('/updateVerify', user.updateConfirm)
            .get('/search/:s', user.detailUser)

module.exports = Router;