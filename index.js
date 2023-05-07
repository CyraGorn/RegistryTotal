const express = require('express');
const path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var StaffModel = require('./models/Staff.js');
const AuthMiddleware = require('./middleware/AuthMiddleware.js');
const jwt = require('./helpers/JWTHelper.js');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://localhost/registrytotal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const PORT = 3000;
var app = express();

app.use('/static', express.static(path.resolve('static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

var router = require(__dirname + '/router.js');
app.use('/api', router);

app.get('/', AuthMiddleware, async (req, res, next) => {
    var token = req.cookies.session
    var kq = await jwt.verify(token);
    return res.json({
        token: token,
        ketqua: kq
    })
});

app.post('/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    try {
        const user = await StaffModel.findOne({ email: email });
        if (!user) {
            return res.status(422).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(422).json({ error: 'Invalid email or password' });
        }
        var token = await jwt.sign({
            user: email,
            isAdmin: user.isAdmin
        });
        var kq = await jwt.verify(token);
        res.cookie('session', token, { httpOnly: true, sameSite: true, secure: true });
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

app.get('/login', (req, res) => {
    res.clearCookie('session');
    res.sendFile(__dirname + '/views/login.html');
})

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    return res.redirect('/login');
});

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});