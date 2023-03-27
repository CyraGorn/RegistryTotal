const express = require('express');
var app = express();
const path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
const PORT = 3000;

app.use('/static', express.static(path.resolve('static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var router = require(__dirname + '/router.js');
app.use('/admin', router);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});