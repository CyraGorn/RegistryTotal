const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const OwnerModel = require('./models/CarOwners.js');

var router = express.Router();

router.get('/staff', RestrictAPI, (req, res) => {
    StaffModel.find({

    }).populate('workFor').then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(500).json("Unexpected Error");
    })
});

router.get('/office', (req, res) => {
    OfficeModel.find({

    }).populate('staff').then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(500).json("Unexpected Error");
    })
});

router.get('/car', (req, res) => {
    OwnerModel.find({

    }).populate('ownedCar').then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(500).json("Unexpected Error");
    })
})

module.exports = router;