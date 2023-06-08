const StaffModel = require('../models/Staff');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
    let result = req.result;
    let oldPass = req.body.oldpass;
    let newPass = req.body.newpass;
    let confirmPass = req.body.cfpass;
    if (oldPass === undefined || newPass === undefined || confirmPass === undefined) {
        return res.status(422).json("MISSING DATA");
    }
    let user = await StaffModel.findOne({
        _id: result['id']
    }).select("password").catch((err) => {
        return res.status(500).json("SERVER UNAVAILABLE");
    });
    let isMatch = await bcrypt.compare(oldPass, user['password']);
    if (!isMatch) {
        return res.status(422).json("WRONG PASSWORD");
    }
    if (typeof (newPass) !== "string" || typeof (confirmPass) !== "string"
        || newPass !== confirmPass || newPass.length < 8) {
        return res.status(422).json("New password and confirmation password must be the same and must have at least 8 characters");
    }
    next();
}