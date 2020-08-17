const express = require('express');
const Router = express.Router();
const loan = require('../controller/loanController');

Router  .post('/loanInsert', loan.addLoan)
        .get('/all', loan.getAllLoan)
        .get('/id/:id', loan.loanById)
        .post('/confirm/:id', loan.confirmLoan)

module.exports = Router;