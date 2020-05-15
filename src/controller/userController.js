const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
        knex('user')
        .then((result) => {
            res.status(200).json({
                status: 200,
                res: result
            })
        })
        .catch((error) => {
            res.send(error)
        })
    },
    insertUser: (req, res) => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                return res.status(400).json({
                    message: 'error bcrypt'
                })
            } else{
                const {
                    fullname,
                    email,
                    telephone,
                    address
                } = req.body;

                const data = {
                    fullname,
                    email,
                    telephone,
                    password: hash,
                    address,
                    is_active: 0,
                    token: 1337,
                    role_id: 1
                }
                knex('user').where({
                    email: email
                }).then((result) => {
                    console.log(result.length)
                    if(result.length == 1){
                        res.status(400).json({
                            status: 200,
                            message: 'Email Was Exist !'
                        })
                    } else {
                        knex('user').insert(data)
                        .then((result) => {
                            res.status(200).json({
                                status: 200,
                                messages: 'Berhasil Sign-up',
                                result: result
                            })
                        })
                        .catch((error) => {
                            res.send(error)
                        })
                    }
                })
            }
        })
    },
    loginUser : (req, res) => {
        const {
            email,
            password
        } = req.body

        const data = {
            email,
            password
        }
        knex('user').where({
            email: email
        }).then((result) => {

            if(result.length == 1){
                
                bcrypt.compare(data.password, result[0].password, (err, rehash) => {
                    
                    if(rehash){

                        let Ud = result[0]
                        let tokenw = jwt.sign({ id: Ud.id, email: Ud.email}, 'irhashGans');
                        delete Ud.password
                        Ud.token = tokenw
                       res.status(200).json({
                           status: 200,
                           message: 'Berhasil Login',
                           response:  Ud
                       })
                    } else {
                        res.send('Password Salah')
                    }
                })

            } else {
                res.send('Email Not Registered!')
            }
        }).catch((error) => {
            res.send(error)
        })
    }
}