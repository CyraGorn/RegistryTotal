const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const AuthHeader = require('./middleware/AuthHeader.js');
const AuthOffice = require('./middleware/AuthOffice.js');
const AuthStaffData = require('./middleware/AuthStaffData.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const RegistryModel = require('./models/Registry.js');
const ObjectId = require('mongoose').Types.ObjectId;

var router = express.Router();

router.get('/allstaff', AuthHeader, (req, res) => {
    let result = req.result;
    if (result['isAdmin'] !== 1) {
        return res.status(404).json("NOT FOUND");
    }
    StaffModel.find({

    }).select("data isAdmin email workFor").then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        return res.status(404).json("NOT FOUND");
    })
});

router.get('/owninfo', AuthHeader, (req, res) => {
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        StaffModel.findOne({
            email: result['user']
        }).select("data isAdmin email workFor").then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        })
    }
});

router.post('/addstaff', AuthHeader, AuthStaffData, (req, res) => {
    StaffModel.create({
        data: {
            name: req.body.name,
            dateOfBirth: req.body.dob,
            SSN: req.body.ssn,
            phone: req.body.phone
        },
        isAdmin: req.body.isAdmin,
        email: req.body.email,
        password: req.body.password,
        workFor: req.body.workFor,
    }).then((data) => {
        if (data) {
            return res.status(200).json("SUCCEEDED");
        }
    }).catch((err) => {
        return res.status(500).json("DATA DUPLICATED");
    });
});

router.get('/office', AuthHeader, AuthOffice, (req, res) => {
    let result = req.result;
    if (result === undefined || result['isAdmin'] === 0) {
        res.status(404).json("NOT FOUND");
    } else {
        OfficeModel.find({

        }).select("name _id").then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
});

router.post('/office/:id/car', AuthHeader, AuthOffice, (req, res) => {
    let id = req.params.id;
    let time = req.body.time;
    let unit = String(req.body.unit);
    let result = req.result;
    let timeDict = {
        month: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        quarter: ["1", "2", "3", "4"],
        year: "1"
    }
    if (result === undefined || id === undefined || time === undefined
        || unit === undefined || !(time in timeDict) || !timeDict[time].includes(unit)) {
        res.status(404).json("NOT FOUND");
    } else {
        var yearNow = new Date();
        yearNow = yearNow.getFullYear();
        var monthNow = new Date();
        monthNow = monthNow.getMonth() + 1;
        var searchQuery = {
            regisPlace: new ObjectId(id)
        };
        if (time === "year") {
            searchQuery['regisDate'] = {
                $gte: new Date(yearNow, 0, 1),
                $lt: new Date(yearNow + 1, 0, 1)
            }
        } else if (time === "quarter") {
            searchQuery['regisDate'] = {
                $gte: new Date(yearNow, 3 * (Number(unit) - 1), 1),
                $lt: new Date(yearNow, 3 * Number(unit), 1)
            }
        } else {
            searchQuery['regisDate'] = {
                $gte: new Date(yearNow, Number(unit) - 1, 1),
                $lt: new Date(yearNow, Number(unit), 1)
            }
        }
        RegistryModel.find(searchQuery).select("car regisDate expiredDate").populate("car").then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
});

router.post('/office/:id/outdatecar', AuthHeader, AuthOffice, (req, res) => {
    let id = req.params.id;
    let status = req.body.status;
    let result = req.result;
    if (result === undefined || id === undefined || status === undefined
        || (status !== "expire" && status !== "soon")) {
        res.status(404).json("NOT FOUND");
    } else {
        var now = new Date();
        var thisMonth = new Date();
        thisMonth.setMonth(now.getMonth() + 1);
        if (thisMonth.getMonth() == 11) {
            thisMonth = new Date(`01/01/${thisMonth.getFullYear() + 1}`);
        } else {
            thisMonth = new Date(`${thisMonth.getMonth() + 1}/01/${thisMonth.getFullYear()}`);
        }
        var searchQuery = {
            regisPlace: new ObjectId(id)
        };
        if (status === "expire") {
            searchQuery['expiredDate'] = {
                $lte: now
            }
        } else {
            searchQuery['expiredDate'] = {
                $gt: now,
                $lt: thisMonth
            }
        }
        RegistryModel.find(searchQuery).select("car expiredDate").populate("car").populate({
            path: "car",
            populate: {
                path: "owner",
                model: "CarOwners"
            }
        }).then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
});

module.exports = router;