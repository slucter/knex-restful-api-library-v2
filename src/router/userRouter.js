const express = require('express');
const user = require('../controller/userController')
const Router = express.Router();

Router      .get('/', user.getAllUser)

module.exports = Router;