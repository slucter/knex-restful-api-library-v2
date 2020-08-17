const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const md5 = require('md5')
const nodemailer = require('nodemailer');
const { json } = require('body-parser');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'slucter133@gmail.com',
        pass: 'canseris123',
    }
});
const knex = require('knex')({
    client: 'mysql',
    connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
    }
})

module.exports = {
    getAllUser: (req, res) => {
        knex('user')
        .then((result) => {
            // let dataNy = result[0]
            // delete dataNy.password
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
                    username
                } = req.body;
                let salting = md5(email);
                const data = {
                    fullname,
                    email,
                    telephone: 0,
                    password: hash,
                    address: 'default',
                    username,
                    is_active: 0,
                    token: 1337,
                    role_id: 1,
                    salting: salting,
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
                            console.log(result)
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
                        let tokenw = jwt.sign({ id: Ud.id, email: Ud.email, salt: Ud.salt, role: Ud.role_id}, 'irhashGans');
                        delete Ud.password
                        Ud.token = tokenw
                        res.status(200).json({
                           status: 200,
                           message: 'Berhasil Login',
                           code: 1,
                           response:  Ud
                       })
                    //    console.log(rehash)
                    } else {
                        let Ud = result[0]
                        res.status(200).json({
                            status: 401,
                            message: 'Password Salah',
                            response:  Ud,
                            code: 2
                        })
                        // console.log(rehash)
                    }
                })

            } else {
                let Ud = result[0]
                res.status(200).json({
                    status: 401,
                    message: 'User tidak terdaftar!',
                    response:  Ud,
                    code: 3
                })
            }
        }).catch((error) => {
            res.send(error)
        })
    },
    detailUser : (req, res)=>{
        const who = req.params.s;
        knex('user')
        .where({id: who})
        .then((rst)=>{
            res.status(200).json({
                staus: 200,
                rst,
            })
        })
        .catch(()=>{
            res.status(200).json({
                staus: 404,
                msg: 'Not Found',
            })
        })
    },
    sendMail : (req, res)=>{
        const { subject, email, text } = req.body;
        const mailOptions = {
            from: 'irhashjeh@gmail.com',
            to: email,
            subject: subject,
            text: text,
        }
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                res.status(200).json({
                    status: 401,
                    msg: 'Error',
                })
            }else{
                res.status(200).json({
                    status: 200,
                    msg: 'success',
                })
            }
        })
    },
    updateConfirm : (req, res)=>{
        const token = req.query.token;
        jwt.verify(token, 'irhashGans', (err, ress)=>{
            if(err){
                res.status(200).json({
                    status: 401,
                    msg: 'Token Invalid'
                })
            }else{
                knex('user').where({
                    id: ress.id
                }).update({
                    is_active: 1,
                })
                .then((result)=>{
                    res.status(200).json({
                        status: 200,
                        msg: 'Token Valid',
                        res: result
                    })
                })
                .catch((err)=>{
                    console.log(err)
                })
            }
        })
    }
}