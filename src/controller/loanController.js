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
    addLoan : (req, res)=>{
        const { id_book, id_user} = req.body;
        const data = {
            id_book,
            id_user,
            start_at: 0,
            end_at: 0,
            loan_time: 0,
            confirmed: false
        }
        knex('loan').insert(data)
        .then((result)=>{
            res.status(200).json({
                status: 200,
                msg: 'Berhasil Insert Loan!',
                result,
            })
        }).catch((err)=>{
            console.log(err);
        })
    },
    getAllLoan: (req, res)=>{
        knex('loan').innerJoin('user', 'loan.id_user', 'user.id').innerJoin('book', 'loan.id_book', 'book.id')
        .then((result)=>{
            delete result.password;
            delete result.role_id;
            delete result.salting;
            res.status(200).json({
                status: 200,
                loans: result,
            });
        })
    },
    loanById: (req, res)=>{
        const myId = req.params.id;
        knex('loan').innerJoin('user', 'loan.id_user', 'user.id').innerJoin('book', 'loan.id_book', 'book.id')
        .where({id_user: myId}).then((rst)=>{
            res.status(200).json({
                status: 200,
                msg: 'get by id user',
                loans: rst,
            })
        })
    },
    confirmLoan: (req, res)=>{
        const idBook = req.params.id;
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var day = parseInt(dd) + 7;
        today = dd + '/' + mm + '/' + yyyy;
        var end = day + '/' + mm + '/' + yyyy;
        knex('loan').where({id_loan: idBook}).update({
            confirmed: 1,
            start_at: today,
            end_at: end,
            loan_time: 7,
        })
        .then((result)=>{
            res.status(200).json({
                status: 200,
                msg: 'Success Update Loan!',
                result,
            });
        })
    }
}