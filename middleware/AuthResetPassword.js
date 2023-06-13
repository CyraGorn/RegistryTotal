const TokenModel = require('../models/Token');
const bcrypt = require('bcrypt')

module.exports = async (req, res, next) => {
    if (!token || !userid || !newPass || !confirmPass
        || typeof (req.body.newpassword) !== 'string' || typeof (req.body.confirmpassword) !== 'string') {
        return res.status(404).json("Invalid or expired password reset token");
    }
    let token = req.params.token;
    let userid = req.params.userid;
    let newPass = String(req.body.newpassword);
    let confirmPass = String(req.body.confirmpassword);
    let existToken = await TokenModel.findOne({
        userId: userid
    }).catch((err) => {
        return res.status(500).json("SERVER UNAVAILABLE");
    });
    if (!existToken) {
        return res.status(404).json("Invalid or expired password reset token");
    }
    const isValidToken = await bcrypt.compare(token, existToken['token']);
    if (!isValidToken) {
        return res.status(404).json("Invalid or expired password reset token");
    }
    if (newPass !== confirmPass || newPass.length < 8) {
        return res.status(404).json("New password and confirmation password must be the same and must have at least 8 characters")
    }
    req.existToken = existToken;
    next();
}
