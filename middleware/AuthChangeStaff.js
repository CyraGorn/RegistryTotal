const Validation = require('../utils/Validation');

module.exports = async (req, res, next) => {
    if (req.body.id === undefined || req.body.email === undefined
        || req.body.password === undefined || req.body.name === undefined
        || req.body.dob === undefined || req.body.ssn === undefined
        || req.body.phone === undefined) {
        return res.status(422).json("MISSING DATA");
    }
    let id = req.body.id;
    let email = req.body.email;
    let password = req.body.password;
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
        return res.status(422).json("Date of birth is invalid. User age must be between 18 and 60");
    }
    if (!Validation.checkValidPhone(phone)) {
        return res.status(422).json("Phone number must have 10 numbers and start with 0");
    }
    if (!Validation.checkValidSSN(ssn)) {
        return res.status(422).json("Social security number is invalid, SSN must have 12 numbers");
    }
    let validstaff = await Validation.checkValidStaffID(id);
    if (!validstaff || (validstaff && validstaff['isAdmin'] === 1)) {
        return res.status(422).json("Invalid staff ID");
    }
    req.name = name;
    next();
}