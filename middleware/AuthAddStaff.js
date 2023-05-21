const Validation = require('../utils/Validation');

module.exports = async (req, res, next) => {
    if (req.body.isAdmin === undefined || req.body.email === undefined
        || req.body.password === undefined || req.body.workFor === undefined
        || req.body.name === undefined || req.body.dob === undefined
        || req.body.ssn === undefined || req.body.phone === undefined) {
        return res.status(422).json("MISSING DATA");
    }
    let isAdmin = req.body.isAdmin;
    let email = req.body.email;
    let password = req.body.password;
    let workFor = req.body.workFor;
    let name = req.body.name;
    let dob = req.body.dob;
    let ssn = req.body.ssn;
    let phone = req.body.phone;
    var validName = Validation.checkValidName(name);
    if (validName[0] === true) {
        name = validName[1];
    } else {
        return res.status(422).json("Name must have at least two words with length smaller than 20 and mustn't contain digits or special characters");
    }
    if (!Validation.checkValidEmail(email)) {
        return res.status(422).json("Email is invalid");
    }
    if (!Validation.checkValidDOB(dob)) {
        return res.status(422).json("Date of birth is invalid. Age must be between 18 and 60");
    }
    if (!Validation.checkValidPhone(phone)) {
        return res.status(422).json("Phone number must have 10 numbers and start with 0");
    }
    if (!Validation.checkValidSSN(ssn)) {
        return res.status(422).json("Social security number is invalid, SSN must have 12 numbers");
    }
    let validoffice = await Validation.checkValidOffice(Number(isAdmin), workFor);
    if (!validoffice) {
        return res.status(422).json("Office is invalid. Admin can't work for non-admin center and non-admin staff can't work for admin center");
    }
    req.officeid = validoffice['_id'];
    req.name = name;
    next();
}