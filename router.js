const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const OwnerModel = require('./models/CarOwners.js');
const RegistryModel = require('./models/Registry.js');
const ObjectId = require('mongoose').Types.ObjectId;
const jwt = require('./helpers/JWTHelper.js');
var router = express.Router();

function authorizeHeader(headers) {
    let token;
    if (headers && headers.startsWith('Bearer')) {
        token = headers.split(' ')[1];
        try {
            var res = jwt.verify(token);
            return res;
        } catch (err) {
            return undefined;
        }
    } else {
        return undefined;
    }
}

router.get('/staff', async (req, res) => {
    let result = authorizeHeader(req.headers.authorization);
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        StaffModel.findOne({
            email: result['user']
        }).select("data isAdmin email workFor").populate('workFor').then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            console.log(err);
            return res.status(404).json("NOT FOUND");
        })
    }
});


router.get('/office', (req, res) => { //office/:id
    let result = authorizeHeader(req.headers.authorization);
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        OfficeModel.findById(new ObjectId('64587046bd9f4cdcc838f92a')).then((off) => {
            res.status(200).json(off);
        }).catch((err) => {
            console.log(err);
            res.status(404).json("NOT FOUND");
        })
    }
});

router.get('/office/car', (req, res) => { //office/:id/car
    let result = authorizeHeader(req.headers.authorization);
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        RegistryModel.find({
            regisPlace: new ObjectId("64587046bd9f4cdcc838f92b")
        }).select("regisStaff car regisDate expiredDate").populate("car").populate({
            path: "regisStaff",
            select: "data isAdmin email"
        }).then((data) => {
            console.log(data.length);
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
})


module.exports = router;