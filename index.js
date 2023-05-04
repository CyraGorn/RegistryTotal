const express = require('express');
var app = express();
const path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var AccountModel = require('./testDB.js');
const AuthMiddleware = require('./middleware/AuthMiddleware.js');
const jwt = require('./helpers/JWTHelper.js');
const { createSecretKey } = require('crypto');

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

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/views/login.html');
// })

app.post('/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var token = await jwt.sign({ user: email });
    var kq = await jwt.verify(token);
    res.cookie('session', token, { httpOnly: true, sameSite: true, secure: true });
    // return res.json({
    //     token: token,
    //     message: "thanh cong",
    //     ketqua: kq
    // })
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.clearCookie('session');
    res.sendFile(__dirname + '/views/login.html');
})

app.post('/register', (req, res) => {
    // AccountModel.findOne({
    //     email: email,
    //     password: password
    // }).then((data) => {
    //     console.log(data);
    //     if (data) {
    //         res.send("Tim thay tai khoan");
    //     } else {
    //         res.send("Khong co tai khoan");
    //     }
    // }).catch((err) => {
    //     res.status(500).send();
    // })
})

app.get('/logout', (req, res) => {
    res.clearCookie('session');
    return res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});