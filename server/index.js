const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const router = express.Router();
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.set('port', 3000);
app.use('/api', router);
app.use(require('../router'));

mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.kfyb4jw.mongodb.net/registrytotal?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(function (req, res, next) {
    return res.status(404).json("NOT FOUND");
});

module.exports = app;