const knex = require('knex')({
    client: 'mysql',
    connection: {
    host : 'localhost',
    user : 'slucter',
    password : 'ASDqwe123!@#',
    database : 'library_web'
    }
})

module.exports = {
    getAllUser: (req, res) => {
        res.send('this is user api')
    }
}