const express = require('express');
const app = express();
const router = require('./src/router/index')
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb',
}));

app.use(bodyParser.json({}));
app.use('/api/library', cors(), router);
app.listen(7878, ()=> console.log('listening...'))