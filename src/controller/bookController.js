require('dotenv').config();
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
    getAllBook : (req, res) => {
        knex('book')
        .then((result)=>{
            res.status(200).json({
                msg: 'success',
                result: result
            })
        })
    },
    insertBook : (req, res) => {
        const {
            title,
            description,
            author,
        } = req.body;
        const bookUri = (title) => {
            const datew = new Date().toLocaleDateString().replace('/','-').replace('/','-')
            let uri = title.toLowerCase().split(" ").join("-")
            let uri2 = `book-${datew}-${uri}`
            return uri2
          }
        const data = {
            title,
            description,
            author,
            image: 'https://semantic-ui.com/images/wireframe/image.png',
            id_category: 2,
            created_at: new Date(),
            uri_book: bookUri(title),
            status: 1
        }

        knex('book').insert(data)
        .then(()=>{
            res.status(200).json({
                status: 200,
                message: 'Berhasil menambahkan buku !'
            })
        })
    },
    updateBook : (req, res) => {
        const idBook = req.params.id
        const {
            title,
            description,
            author,
        } = req.body;
        const data = {
            title,
            description,
            author,
            image: 'https://semantic-ui.com/images/wireframe/image.png',
            id_category: 2,
            created_at: new Date()
        }
        knex('book').where('id', idBook).update(data)
        .then(() => {
            res.status(200).json({
                status: 200,
                message: 'Berhasil Update Buku'
            })
        })
    },
    deleteBook : (req, res) => {
        const idBook = req.params.id
        knex('book').where('id', idBook).del()
        .then(()=>{
            res.status(200).json({
                status: 200,
                message: 'Berhasil Menghapus !'
            })
        })
        .catch((error)=>{
            res.status(400).json({
                status: 400,
                message: error
            })
        })
    },
    searchBook : (req, res) => {
        const cari = req.query.cari

        knex('book')
        .where('author', 'like', `%${cari}%`)
        .orWhere('title', 'like', `%${cari}%`)
        .orWhere('description', 'like', `%${cari}%`)
        .select('*')
        .then((result)=>{
            // console.log(result.length)
            if(result.length >= 1){
                res.status(200).json({
                    status: 200,
                    response: result
                })
            }else{
                res.status(404).json({
                    status: 404,
                    messages: 'Not Found'
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    },
    sortBook: (req, res) => {
        const by = req.query.by

        knex('book')
        .join('book_category', 'book.id_category', '=', 'book_category.id_category')
        .select('*')
        .orderBy(by)
        .then((result)=>{
            res.status(200).json({
                status: 200,
                response: result
            })
        })
        .catch((error) => {
            res.send(error)
        })
    },
    detailsBook : (req, res) => {
        const params = req.params.detail
        console.log(params)
        knex('book')
        .join('book_category', 'book.id_category', '=', 'book_category.id_category')
        .select('*')
        .where({
            id: params
        })
        .orWhere({
            uri_book: params
        })
        .then((result)=>{
            res.status(200).json({
                status: 200,
                response: result
            })
        })
        .catch((error) => {
            res.send(error)
        })
    },
}