const express = require('express');
const book = require('./bookRouter')
const user = require('./userRouter')
const Router = express.Router();

Router  .use('/book', book)
        .use('/user', user)

module.exports = Router;