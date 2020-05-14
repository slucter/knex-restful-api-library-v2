const express = require('express');
const book = require('./bookRouter')
const Router = express.Router();

Router.use('/book', book)

module.exports = Router;