const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const AuthHeader = require('./middleware/AuthHeader.js');
const AuthOffice = require('./middleware/AuthOffice.js');
const AuthStaffData = require('./middleware/AuthStaffData.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const RegistryModel = require('./models/Registry.js');
const CarModel = require('./models/Cars.js');
const ObjectId = require('mongoose').Types.ObjectId;

var router = express.Router();

router.get('/allstaff', AuthHeader, (req, res) => {
    let result = req.result;
    if (result['isAdmin'] !== 1) {
        return res.status(404).json("NOT FOUND");
    }
    StaffModel.find({

    }).select("data isAdmin email workFor").then((data) => {
        var total = data.length;
        var returnRes = {
            total: total,
            data: data
        }
        res.status(200).json(returnRes);
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
        }).select("data isAdmin email workFor _id registed").populate({
            path: "workFor",
            select: "name"
        }).populate({
            path: "registed",
            populate: {
                path: "car",
                model: "Cars",
                select: "numberPlate"
            },
            select: "_id regisDate"{
        }).then(async (data) => {
            res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        })
    }
});

router.get('/inspection/:id', AuthHeader, async (req, res) => {
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        var registryInspection = await RegistryModel.findOne({
            _id: req.params.id
        }).select("regisStaff regisNum car regisDate expiredDate").populate("car").catch((err) => {
            return res.status(404).json("NOT FOUND");
        });
        if (result['isAdmin'] !== 1 && result['id'] !== registryInspection['regisStaff']) {
            return res.status(404).json("NOT FOUND");
        } else {
            return res.status(200).json(registryInspection);
        }
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
        workFor: req.officeid,
    }).then((data) => {
        if (data) {
            return res.status(200).json("SUCCEEDED");
        }
    }).catch((err) => {
        return res.status(500).json("User already existed");
    });
});

router.get('/office', AuthHeader, AuthOffice, (req, res) => {
    let result = req.result;
    if (result === undefined || result['isAdmin'] === 0) {
        res.status(404).json("NOT FOUND");
    } else {
        OfficeModel.find({

        }).select("name _id hotline hotMail address").then((data) => {
            var total = data.length;
            var returnRes = {
                total: total,
                data: data
            }
            res.status(200).json(returnRes);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
});

router.get('/office/:id', AuthHeader, AuthOffice, (req, res) => {
    let result = req.result;
    if (result === undefined) {
        res.status(404).json("NOT FOUND");
    } else {
        OfficeModel.find({
            _id: req.params.id
        }).populate("staff").then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }
});

router.post('/office/:id/car', AuthHeader, AuthOffice, (req, res) => {
    // Car registed in this office
    let id = req.params.id;
    let time = String(req.body.time);
    let unit = String(req.body.unit);
    let result = req.result;
    let timeDict = {
        month: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        quarter: ["1", "2", "3", "4"],
        year: [] // 3 years from now - 2 to now
    }
    let yearList = new Date();
    for (var i = yearList.getFullYear() - 2; i <= yearList.getFullYear(); i++) {
        timeDict['year'].push(String(i));
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
        if (id === result['workFor'] && result['isAdmin'] === 1) { // all office
            delete searchQuery['regisPlace']
        }
        if (time === "year") {
            searchQuery['regisDate'] = {
                $gte: new Date(Number(unit), 0, 1),
                $lt: new Date(Number(unit) + 1, 0, 1)
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
        // RegistryModel.find(searchQuery).select('car').distinct('car').then((data) => {
        //     var total = data.length;
        //     var returnRes = {
        //         total: total,
        //         data: data
        //     }
        //     res.status(200).json(returnRes);
        // }).catch((err) => {
        //     console.log(err);
        //     res.status(404).json("NOT FOUND");
        // });
        RegistryModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $group: {
                    _id: "$car"
                }
            },
            {
                $project: {
                    _id: 0,
                    car: "$_id",
                }
            },
            {
                $lookup: {
                    from: "Cars",
                    localField: "car",
                    foreignField: "_id",
                    as: "car"
                }
            }
        ]).then((data) => {
            var total = data.length;
            var returnRes = {
                total: total,
                data: data
            }
            res.status(200).json(returnRes);
        }).catch((err) => {
            console.log(err);
        });
    }
});

router.post('/office/:id/outdatecar', AuthHeader, AuthOffice, (req, res) => {
    // All expire car and soon expire car in this office
    // Separate by parameter status
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
        if (id === result['workFor'] && result['isAdmin'] === 1) { // all office
            delete searchQuery['regisPlace']
        }
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
        // RegistryModel.find(searchQuery).select("car expiredDate").populate({
        //     path: "car",
        //     populate: {
        //         path: "owner",
        //         model: "CarOwners"
        //     },
        //     select: "certificate numberPlate owner"
        // }).then((data) => {
        //     var total = data.length;
        //     var returnRes = {
        //         total: total,
        //         data: data
        //     }
        //     res.status(200).json(returnRes);
        // }).catch((err) => {
        //     console.log(err)
        //     res.status(404).json("NOT FOUND");
        // })
        RegistryModel.aggregate([
            {
                $match: searchQuery
            },
            {
                $sort: {
                    "regisDate": -1
                }
            },
            {
                $group: {
                    _id: {
                        car: "$car",
                        expiredDate: "$expiredDate"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    car: "$_id.car",
                    expireDate: "$_id.expiredDate"
                }
            },
            {
                $lookup: {
                    from: "Cars",
                    localField: "car",
                    foreignField: "_id",
                    as: "car"
                }
            }
        ]).then((data) => {
            var total = data.length;
            var returnRes = {
                total: total,
                data: data
            }
            res.status(200).json(returnRes);
        }).catch((err) => {
            console.log(err);
        });
    }
});

module.exports = router;
