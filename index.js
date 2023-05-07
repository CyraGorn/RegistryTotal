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


mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.v8gw10b.mongodb.net/?retryWrites=true&w=majority', {
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
    var kq = jwt.verify(token).then((kq) => {
        StaffModel.findOne({
            email: kq['user']
        }).populate('workFor').then((data) => {
            return res.json(data);
        }).catch((err) => {
            return res.status(500).json("SERVER ERROR")
        })
    });
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
        var token = jwt.sign({
            user: email,
            isAdmin: user.isAdmin
        }).then((token) => {
            res.cookie('session', token, { httpOnly: true, sameSite: true, secure: true });
            res.redirect('/');
        })
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

app.get('/forgot-password', function (req, res) {
    res.redirect('http://google.com');
});

app.post('/forgot-password', function (req, res) {
    var email = req.body.email;
    var token = generateToken();
    var expirationTime = moment().add(1, 'hour').toDate();
    saveTokenInDatabase(email, token, expirationTime);
    sendResetEmail(email, token);
    res.render('forgot-password-confirm');
});

app.get('/reset-password/:token', function (req, res) {
    var token = req.params.token;
    var isValidToken = checkIfTokenIsValid(token);
    if (isValidToken) {
        res.render('reset-password-form', { token: token });
    } else {
        res.render('invalid-token');
    }
});

app.post('/reset-password/:token', function (req, res) {
    var token = req.params.token;
    var isValidToken = checkIfTokenIsValid(token);
    if (isValidToken) {
        var newPassword = req.body.newPassword;
        var email = getEmailFromToken(token);
        resetPasswordInDatabase(email, newPassword);
        deleteTokenFromDatabase(email, token);
        res.render('reset-password-confirm');
    } else {
        res.render('invalid-token');
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});