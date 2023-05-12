const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const AuthHeader = require('./middleware/AuthHeader.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const OwnerModel = require('./models/CarOwners.js');
const RegistryModel = require('./models/Registry.js');
const ObjectId = require('mongoose').Types.ObjectId;

var router = express.Router();

router.get('/staff', AuthHeader, (req, res) => {
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        StaffModel.findOne({
            email: result['user']
        }).select("data isAdmin email workFor").populate('workFor').then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        })
    }
});

router.get('/office', AuthHeader, (req, res) => {
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        OfficeModel.find({

        }).select("name _id").then((data) => {
            console.log(data.length);
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
});


router.get('/office/:id', AuthHeader, (req, res) => { //office/:id
    let id = req.params.id;
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        try {
            OfficeModel.findById(new ObjectId(id)).then((off) => {
                res.status(200).json(off);
            });
        } catch {
            res.status(404).json("NOT FOUND");
        }
    }
});

router.get('/office/:id/car', AuthHeader, (req, res) => { //office/:id/car
    let id = req.params.id;
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        RegistryModel.find({
            regisPlace: new ObjectId(id)
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
});

module.exports = router;