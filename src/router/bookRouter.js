const express = require('express');
const book = require('../controller/bookController')
const Router = express.Router();

Router      .get('/', book.getAllBook)
            .post('/insert', book.insertBook)
            .get('/search/', book.searchBook)
            .get('/sort', book.sortBook)
            .get('/details/:detail', book.detailsBook)
            .put('/update/:id', book.updateBook)
            .delete('/delete/:id', book.deleteBook)

module.exports = Router;