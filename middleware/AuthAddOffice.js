const Validation = require('../utils/Validation');

module.exports = async (req, res, next) => {
    if (req.body.name === undefined || req.body.address === undefined
        || req.body.city === undefined || req.body.hotline === undefined
        || req.body.hotmail === undefined) {
        return res.status(422).json("MISSING DATA");
    }
    req.body.name = String(req.body.name).trim();
    req.body.address = String(req.body.address).trim();
    req.body.city = String(req.body.city).trim();
    req.body.hotline = String(req.body.hotline).trim();
    req.body.hotmail = String(req.body.hotmail).trim();
    if (!Validation.checkAlphabetNumericString(req.body.name, 60)
        && !Validation.checkValidName(req.body.name, 60)[0]) {
        return res.status(422).json("Name must have at least two words with length smaller than 60 and mustn't contain digits or special characters");
    }
    if (!Validation.checkValidProvince(req.body.city)) {
        return res.status(422).json("City is invalid");
    }
    if (!Validation.checkAlphabetNumericString(req.body.address, 100)
        && !req.body.address.includes(req.body.city)) {
        return res.status(422).json("Address is invalid");
    }
    if (!Validation.checkValidEmail(req.body.hotmail)) {
        return res.status(422).json("Email is invalid");
    }
    if (!Validation.checkValidPhone(req.body.hotline)) {
        return res.status(422).json("Phone number must have 10 numbers and start with 0");
    }
    next();
}