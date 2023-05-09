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


mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.v8gw10b.mongodb.net/registrytotal?retryWrites=true&w=majority', {
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

app.post('/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    try {
        const user = await StaffModel.findOne({
            email: email
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !isMatch) {
            res.status(422).json({ error: 'Invalid email or password' });
        } else {
            delete user.password;
            console.log(user);
            var token = jwt.sign({
                user: user.email,
                isAdmin: user.isAdmin
            });
            res.cookie('session', token, {
                httpOnly: true,
                sameSite: true,
                secure: true,
            });
            data = {
                session: token,
                user: user
            }
            res.status(200).json(data);
        }
    } catch (err) {
        res.status(422).json({ error: 'Invalid email or password' });
    }
});

app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});