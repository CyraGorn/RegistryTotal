const express = require('express');
var app = express();
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

app.use('/static', express.static(path.resolve('static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

var router = require(__dirname + '/router.js');
app.use('/admin', router);

app.get('/', AuthMiddleware, async (req, res, next) => {
    var token = req.cookies.session
    var kq = await jwt.verify(token);
    return res.json({
        token: token,
        message: "thanh cong",
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
    // console.log(email, password);
    // StaffModel.findOne({
    //     email: email
    // }).then(async (data) => {
    //     if (!data) {
    //         res.redirect('/');
    //     }
    //     bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    //         if (err) return cb(err);
    //         cb(null, isMatch);
    //     });
    //     console.log(data);
    //     if (data) {
    //         console.log("vaicalon");
    //         var token = await jwt.sign({ user: email });
    //         var kq = await jwt.verify(token);
    //         res.cookie('session', token, { httpOnly: true, sameSite: true, secure: true });
    //         res.redirect('/');
    //     } else {
    //         res.send("Khong co tai khoan");
    //     }
    // }).catch((err) => {
    //     res.status(500).send();
    // })
});

app.get('/login', (req, res) => {
    res.clearCookie('session');
    res.sendFile(__dirname + '/views/login.html');
})

app.post('/register', (req, res) => {
    AccountModel.findOne({
        email: email,
        password: password
    }).then((data) => {
        console.log(data);
        if (data) {
            res.send("Tim thay tai khoan");
        } else {
            res.send("Khong co tai khoan");
        }
    }).catch((err) => {
        res.status(500).send();
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    return res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});