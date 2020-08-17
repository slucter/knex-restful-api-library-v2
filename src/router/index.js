const express = require('express');
const book = require('./bookRouter')
const user = require('./userRouter')
const loan = require('./loanRouter')
const Router = express.Router();

Router  .use('/book', book)
        .use('/user', user)
        .use('/loan', loan)

module.exports = Router;