const RegistryModel = require('../models/Registry');
const CarsModel = require('../models/Cars');
const Validation = require('../utils/Validation');

function validateOwnerData(req, res) {
    if (!Validation.checkValidName(req.body.ownername)[0]) {
        return "Name must have at least two words with length smaller than 20 and mustn't contain digits or special characters";
    }
    if (!Validation.checkValidEmail(req.body.owneremail)) {
        return "Email is invalid";
    }
    if (!Validation.checkValidDOB(req.body.ownerdob)) {
        return "Date of birth is invalid. Age must be between 18 and 60";
    }
    if (!Validation.checkValidPhone(req.body.ownerphone)) {
        return "Phone number must have 10 numbers and start with 0";
    }
    if (!Validation.checkValidSSN(req.body.ownerssn)) {
        return "Social security number is invalid, SSN must have 12 numbers";
    }
    return true;
}

function validateCarData(req, res) {
    if (!Validation.checkValidPlate(req.body.carNumberPlate,)) {
        return "Plate number is invalid";
    }
    if (!Validation.checkValidName(req.body.Type)[0]) {
        return "Car type mustn't contain digit or special characters or whitespace and length must be less than 20 characters";
    }
    if (!Validation.checkAlphabetString(req.body.Mark)) {
        return "Car brand mustn't contain digit or special characters or whitespace and length must be less than 20 characters";
    }
    if (!Validation.checkAlphabetNumericString(req.body.ModelCode)) {
        return "Model code mustn't contain special characters or whitespace and length must be less than 20 characters";
    }
    if (!Validation.checkAlphabetNumericString(req.body.EngineNumber)) {
        return "Engine number mustn't contain special characters or whitespace and length must be less than 20 characters";
    }
    if (!Validation.checkAlphabetNumericString(req.body.ChassisNumber)) {
        return "Chassis number mustn't contain special characters or whitespace and length must be less than 20 characters";
    }
    if (req.body.purpose != "Cá nhân" && req.body.purpose != "Kinh doanh" && req.body.purpose != "Cơ quan") {
        return "Purpose is invalid";
    }
    let now = new Date();
    now = now.getFullYear();
    if (!Validation.checkNumber(req.body.ManufacturedYear)
        || Number(req.body.ManufacturedYear) > now || Number(req.body.ManufacturedYear) < now - 60) {
        return "Manufacture year mustn't greater than now or less than 60 years before";
    }
    if (!Validation.checkValidCountry(req.body.ManufacturedCountry)) {
        return "Manufacture country is invalid";
    }
    if (!Validation.checkValidProvince(req.body.bought)) {
        return "Bought place is invalid";
    }
    if (!Validation.checkValidDOB(req.body.certDate)
        || Number(req.body.certDate) > now || Number(req.body.certDate) < Number(req.body.ManufacturedYear)) {
        return "Certificate date mustn't greater than now or less than manufactured year";
    }
    if (!Validation.checkAlphabetNumericString(req.body.certNum)) {
        return "Certificate number mustn't contain special characters and length must be less than 20";
    }
    return true;
}

function validateSpecification(req, res) {
    if (!Validation.checkValidWheelFormula(req.body.WheelFormula)) {
        return "Wheel formula is invalid. For example: 4x2";
    }
    if (!Validation.checkNumber(req.body.WheelTread)) {
        return "Wheel tread must be a positive integer";
    }
    if (!Validation.checkValidDimension(req.body.OverallDimension)) {
        return "Overall dimension is invalid. For example: 1234x1234x1234";
    }
    if (!Validation.checkValidDimension(req.body.LuggageContainer)) {
        return "Luggage container is invalid. For example: 1234x1234x1234";
    }
    if (!Validation.checkNumber(req.body.WheelBase)) {
        return "Wheel base must be a positive integer";
    }
    if (!Validation.checkNumber(req.body.KerbMass)) {
        return "Kerb mass must be a positive integer";
    }
    if (!Validation.checkNumber(req.body.AuthorizedPayload)) {
        return "Authorized payload must be a positive integer";
    }
    if (!Validation.checkNumber(req.body.AuthorizedTotalMass)) {
        return "Authorized total mass be a positive integer";
    }
    if (!Validation.checkNumber(req.body.AuthorizedTowedMass)) {
        return "Authorized towed mass must be a positive integer";
    }
    if (!Validation.checkNumber(req.body.CarriedNo)) {
        return "Carry number must be a positive integer";
    }
    if (!Validation.checkAlphabetString(req.body.FuelType)) {
        return "Fuel is invalid";
    }
    if (!Validation.checkNumber(req.body.engineDisplacement)) {
        return "Engine displacement must be a positive integer";
    }
    if (!Validation.checkValidRatio(req.body.maxOutputToRpmRatio)) {
        return "Max output to RPM ratio is invalid. For example: 123/1323";
    }
    if (!Validation.checkValidTire(req.body.numberOfTiresAndTireSize)) {
        return "Number of tire or tire size is invalid. For example: 6 - 12/23R34";
    }
    return true;
}

function checkFullData(req, res) {
    if (!req.body.carNumberPlate || !req.body.ownername || !req.body.ownerdob
        || !req.body.ownerssn || !req.body.ownerphone || !req.body.owneremail
        || !req.body.Type || !req.body.Mark || !req.body.ModelCode || !req.body.EngineNumber
        || !req.body.ChassisNumber || !req.body.ManufacturedYear || !req.body.ManufacturedCountry
        || !req.body.WheelFormula || !req.body.WheelTread || !req.body.OverallDimension
        || !req.body.LuggageContainer || !req.body.WheelBase || !req.body.KerbMass
        || !req.body.AuthorizedPayload || !req.body.AuthorizedTotalMass || !req.body.AuthorizedTowedMass
        || !req.body.CarriedNo || !req.body.FuelType || !req.body.engineDisplacement
        || !req.body.maxOutputToRpmRatio || !req.body.numberOfTiresAndTireSize || !req.body.bought
        || !req.body.certDate || !req.body.certNum || !req.body.purpose) {
        return "MISSING DATA";
    }
    return true;
}

module.exports = (req, res, next) => {
    let check1 = checkFullData(req, res);
    if (check1 !== true) {
        return res.status(422).json(check1);
    }
    let check2 = validateOwnerData(req, res);
    if (check2 !== true) {
        return res.status(422).json(check2);
    }
    let check3 = validateCarData(req, res);
    if (check3 !== true) {
        return res.status(422).json(check3);
    }
    let check4 = validateSpecification(req, res);
    if (check4 !== true) {
        return res.status(422).json(check4);
    }
    let alldata = {
        numberPlate: req.body.carNumberPlate,
        owner: {
            data: {
                name: req.body.ownername,
                dateOfBirth: req.body.ownerdob,
                SSN: req.body.ownerssn,
                phone: req.body.ownerphone
            },
            email: req.body.owneremail
        },
        registry: [],
        type: Validation.checkValidName(req.body.Type)[1],
        mark: req.body.Mark,
        modelCode: req.body.ModelCode,
        engineNumber: req.body.EngineNumber,
        chassisNumber: req.body.ChassisNumber,
        manufacturedYear: req.body.ManufacturedYear,
        manufacturedCountry: req.body.ManufacturedCountry,
        specification: {
            wheelFormula: req.body.WheelFormula,
            wheelTread: String(req.body.WheelTread) + " mm",
            overallDimension: String(req.body.OverallDimension) + " mm",
            luggageContainer: String(req.body.LuggageContainer) + " mm",
            wheelBase: String(req.body.WheelBase) + " mm",
            kerbMass: String(req.body.KerbMass) + " kg",
            authorizedPayload: String(req.body.AuthorizedPayload) + " kg",
            authorizedTotalMass: String(req.body.AuthorizedTotalMass) + " kg",
            authorizedTowedMass: String(req.body.AuthorizedTowedMass) + " kg",
            carriedNo: req.body.CarriedNo,
            fuel: req.body.FuelType,
            engineDisplacement: String(req.body.engineDisplacement) + " cc",
            maxOutputToRpmRatio: req.body.maxOutputToRpmRatio,
            numberOfTiresAndTireSize: req.body.numberOfTiresAndTireSize
        },
        purpose: req.body.purpose,
        boughtPlace: req.body.bought,
        certificate: {
            certDate: req.body.certDate,
            certNum: req.body.certNum
        }
    }
    req.alldata = alldata;
    next();
};