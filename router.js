const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const OwnerModel = require('./models/CarOwners.js');
var router = express.Router();

const PAGE_SIZE = 100;

router.get('/staff', (req, res) => {
    var index = req.query.index;
    index = Number(index);
    if (!isNaN(index) && index >= 1) {
        var skipIndex = (index - 1) * PAGE_SIZE;
        StaffModel.find({

        }).skip(skipIndex).limit(PAGE_SIZE).populate('workFor').then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).json("Unexpected Error: " + err);
        })
    } else {
        StaffModel.find({

        }).populate('workFor').then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).json("Unexpected Error: " + err);
        })
    }
});

router.get('/office', (req, res) => {
    var index = req.query.index;
    index = Number(index);
    if (!isNaN(index) && index >= 0) {
        var skipIndex = (index - 1) * PAGE_SIZE;
        OfficeModel.find({

        }).skip(skipIndex).limit(PAGE_SIZE).populate('staff').then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).json("Unexpected Error: " + err);
        })
    } else {
        OfficeModel.find({

        }).populate('staff').then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).json("Unexpected Error");
        })
    }
});

router.get('/car', (req, res) => {
    var index = req.query.index;
    index = Number(index);
    if (!isNaN(index) && index >= 0) {
        var skipIndex = (index - 1) * PAGE_SIZE;
        OwnerModel.find({

        }).skip(skipIndex).limit(PAGE_SIZE).populate('ownedCar').then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).json("Unexpected Error: " + err);
        })
    } else {
        OwnerModel.find({

        }).populate('ownedCar').then((data) => {
            res.json(data);
        }).catch((err) => {
            res.status(500).json("Unexpected Error");
        })
    }
})

module.exports = router;