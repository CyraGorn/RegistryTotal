const Validation = require('../utils/Validation');

module.exports = async (req, res, next) => {
    if (req.body.email === undefined || req.body.name === undefined
        || req.body.dob === undefined || req.body.ssn === undefined
        || req.body.phone === undefined) {
        return res.status(422).json("MISSING DATA");
    }
    let name = String(req.body.name).trim();
    req.body.email = String(req.body.email).trim();
    req.body.phone = String(req.body.phone).trim();
    req.body.ssn = String(req.body.ssn).trim();
    req.body.dob = String(req.body.dob).trim();
    var validName = Validation.checkValidName(name, 20);
    if (validName[0] === true) {
        name = validName[1];
    } else {
        return res.status(422).json("Name must have at least two words with length smaller than 20 and mustn't contain digits or special characters");
    }
    if (!Validation.checkValidEmail(req.body.email)) {
        return res.status(422).json("Email is invalid");
    }
    if (!Validation.checkValidDOB(req.body.dob)) {
        return res.status(422).json("Date of birth is invalid. User age must be between 18 and 60");
    }
    if (!Validation.checkValidPhone(req.body.phone)) {
        return res.status(422).json("Phone number must have 10 numbers and start with 0");
    }
    if (!Validation.checkValidSSN(req.body.ssn)) {
        return res.status(422).json("Social security number is invalid, SSN must have 12 numbers");
    }
    req.name = name;
    next();
}