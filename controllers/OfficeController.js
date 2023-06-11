const OfficeModel = require('../models/RegistryOffice');
const RegistryModel = require('../models/Registry');
const CarsModel = require('../models/Cars');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment-timezone');

class OfficeController {
    static getAllOffice(req, res) {
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
        });
    }

    static getById(req, res) {
        OfficeModel.find({
            _id: req.params.id
        }).populate("staff").then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(404).json("NOT FOUND");
        })
    }

    static addOffice(req, res) {
        OfficeModel.create({
            name: req.body.name,
            isAdmin: 0,
            address: req.body.address,
            city: req.body.city,
            hotline: req.body.hotline,
            hotMail: req.body.hotmail,
            staff: []
        }).then((data) => {
            return res.status(200).json("SUCCEEDED");
        }).catch((err) => {
            return res.status(500).json("DUPLICATE DATA");
        });
    }

    static getRecentRegistry(req, res) {
        let result = req.result;
        let searchQuery = {
            regisPlace: result['workFor']
        }
        if (result['isAdmin'] === 1) {
            delete searchQuery['regisPlace'];
        }
        RegistryModel.find(searchQuery).sort({
            regisDate: -1
        }).limit(10)
            .select("regisNum car regisDate regisPlace expiredDate city").populate([{
                path: "car",
                populate: {
                    path: "owner",
                    select: "email data.name data.dateOfBirth data.SSN data.phone"
                },
                select: "numberPlate owner"
            }, {
                path: "regisPlace",
                select: "name"
            }]).then((data) => {
                return res.status(200).json(data);
            }).catch((err) => {
                return res.status(500).json("SERVER UNAVAILABLE");
            })
    }

    static getOfficeByProvince(req, res) {
        let province = req.body.province;
        OfficeModel.find({
            city: province
        }).select("name address hotline hotMail").sort('name').then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
    }

    static async getCarRegisted(req, res) {
        let result = req.result;
        let id = req.params.id;
        let time = req.body.time;
        let city = req.body.city;
        if (result === undefined || id === undefined || time === undefined
            || isNaN(time) || city === undefined || typeof (city) !== "string"
            || (result['isAdmin'] !== 1 && id !== "own")) {
            return res.status(404).json("NOT FOUND");
        } else {
            try {
                let newID = result['workFor'];
                var searchQuery = {
                    regisPlace: new ObjectId(newID),
                    regisDate: {
                        $gte: new Date(`${time}/01/01`),
                        $lt: new Date(`${Number(time) + 1}/01/01`)
                    }
                };
                if (result['isAdmin'] === 1) { // all office
                    if (id === result['workFor'] || id === "own") {
                        delete searchQuery['regisPlace'];
                    } else {
                        searchQuery['regisPlace'] = new ObjectId(id);
                    }
                    if (city !== "") {
                        searchQuery['city'] = city;
                    }
                }
                let data = await countCarRegisted(searchQuery);
                if (data) {
                    return res.status(200).json({ total: data[1], data: data[0] })
                } else {
                    return res.status(500).json("SERVER UNAVAILABLE");
                }
            } catch (err) {
                console.log(err)
                return res.status(404).json("NOT FOUND")
            }
        }
    }

    static async getNewCar(req, res) {
        let result = req.result;
        let id = req.params.id;   // the office id to retrieve data, if the id is registryVN then will retreive all data
        let city = req.body.city; // only admin can use this
        if (result === undefined || id === undefined || city === undefined
            || typeof (city) !== "string" || (result['isAdmin'] !== 1 && id !== "own")) {
            return res.status(404).json("NOT FOUND");
        } else {
            try {
                let workingCity = await OfficeModel.findOne({
                    _id: result['workFor']
                }).select("city").catch((err) => {
                    return res.status(500).json("SERVER UNAVAILABLE");
                });
                var searchQuery = {
                    boughtPlace: workingCity['city'],
                    registry: {
                        $size: 0
                    }
                };
                if (result['isAdmin'] === 1 && (id === result['workFor'] || id === "own")) { // all office (for admin)
                    if (city === "") {
                        delete searchQuery['boughtPlace'];
                    } else {
                        searchQuery['boughtPlace'] = city;
                    }
                }
                CarsModel.countDocuments(searchQuery).then((data) => {
                    return res.status(200).json({ total: data })
                }).catch((err) => {
                    return res.status(500).json("SERVER UNAVAILABLE");
                })
            } catch (err) {
                return res.status(500).json("SERVER UNAVAILABLE");
            }
        }
    }

    static async getCarOutDate(req, res) {
        let result = req.result;
        let id = req.params.id;
        let status = req.body.status
        let city = req.body.city;
        let info = req.body.info;
        if (result === undefined || id === undefined || status === undefined || info === undefined
            || (status !== "soon" && status !== "expired")
            || city === undefined || typeof (city) !== "string"
            || (result['isAdmin'] !== 1 && id !== "own")
            || (String(info) !== "1" && String(info) !== "0")) {
            return res.status(404).json("NOT FOUND");
        } else {
            try {
                let newID = result['workFor'];
                var now = new Date();
                var expireThisMonth = new Date();
                expireThisMonth.setMonth(now.getMonth() + 1);
                var searchQueryPlace = {
                    "registry.regisPlace": new ObjectId(newID),
                };
                if (result['isAdmin'] === 1) { // all office
                    if (id === result['workFor'] || id === "own") {
                        delete searchQueryPlace['registry.regisPlace'];
                    } else {
                        searchQueryPlace['registry.regisPlace'] = new ObjectId(id);
                    }
                    if (city !== "") {
                        searchQueryPlace["registry.city"] = city;
                    }
                }
                var searchQuerySoonExpired = {};
                var searchQueryExpired = {};
                searchQuerySoonExpired["expiredDate"] = {
                    $gte: now,
                    $lt: expireThisMonth
                }
                searchQueryExpired["expiredDate"] = {
                    $lte: now,
                }
                let data;
                if (info === "0") {
                    let soonExpired = await carOutDate(searchQueryPlace, searchQuerySoonExpired);
                    let expired = await carOutDate(searchQueryPlace, searchQueryExpired);
                    if (soonExpired === null || expired === null) {
                        return res.status(500).json("SERVER UNAVAILABLE");
                    }
                    data = {
                        soon: soonExpired.length,
                        expired: expired.length
                    }
                } else {
                    if (status === "soon") {
                        data = await carOutDate(searchQueryPlace, searchQuerySoonExpired);
                    } else if (status === "expired") {
                        data = await carOutDate(searchQueryPlace, searchQueryExpired);
                    }
                }
                if (data === null) {
                    return res.status(500).json("SERVER UNAVAILABLE");
                }
                return res.status(200).json({ total: data.length, data: data });
            } catch {
                return res.status(404).json("NOT FOUND")
            }
        }
    }
}

async function countCarRegisted(searchQuery) {
    let data = await RegistryModel.aggregate([
        {
            $match: searchQuery
        },
        {
            $group: {
                _id: { month: { $month: "$regisDate" }, year: { $year: "$regisDate" } },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                count: 1
            }
        },
        // {
        //     $project: {
        //         year: {
        //             $year: {
        //                 date: {
        //                     $add: ['$regisDate', 7 * 60 * 60 * 1000 - 15 * 60 * 1000]
        //                 },
        //                 // timezone: 'Asia/Bangkok'
        //             }
        //         },
        //         month: {
        //             $month: {
        //                 date: {
        //                     $add: ['$regisDate', 7 * 60 * 60 * 1000 - 15 * 60 * 1000]
        //                 },
        //                 // timezone: 'Asia/Bangkok'
        //             }
        //         },
        //     }
        // },
        // {
        //     $group: {
        //         _id: { month: "$month", year: "$year" },
        //         count: { $sum: 1 }
        //     }
        // },
        {
            $sort: {
                _id: 1,
                month: 1
            }
        },
        {
            $project: {
                _id: 0,
                month: {
                    $switch: {
                        branches: [
                            { case: { $eq: [1, "$month"] }, then: "Jan" },
                            { case: { $eq: [2, "$month"] }, then: "Feb" },
                            { case: { $eq: [3, "$month"] }, then: "Mar" },
                            { case: { $eq: [4, "$month"] }, then: "Apr" },
                            { case: { $eq: [5, "$month"] }, then: "May" },
                            { case: { $eq: [6, "$month"] }, then: "June" },
                            { case: { $eq: [7, "$month"] }, then: "July" },
                            { case: { $eq: [8, "$month"] }, then: "Aug" },
                            { case: { $eq: [9, "$month"] }, then: "Sept" },
                            { case: { $eq: [10, "$month"] }, then: "Oct" },
                            { case: { $eq: [11, "$month"] }, then: "Nov" },
                            { case: { $eq: [12, "$month"] }, then: "Dec" },
                        ],
                        default: null
                    }
                },
                count: 1
            }
        },
    ]).catch((err) => {
        return null;
    });
    let sum = 0;
    for (var i = 0; i < data.length; i++) {
        sum += data[i]['count']
    }
    return [data, sum];
}

async function carOutDate(searchQueryPlace, searchQueryTime) {
    let data = await CarsModel.aggregate([
        {
            $lookup: {
                from: "Registry",
                localField: "registry",
                foreignField: "_id",
                as: "registry"
            }
        },
        {
            $lookup: {
                from: "CarOwners",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$registry"
        },
        {
            $match: searchQueryPlace
        },
        {
            $sort: {
                "registry.regisDate": -1,
            },
        },
        {
            $group: {
                _id: "$_id",
                registDate: { $first: "$registry.regisDate" },
                numberPlate: { $first: "$numberPlate" },
                expiredDate: { $first: "$registry.expiredDate" },
                city: { $first: "$registry.city" },
                owner: { $first: "$owner" }
            },
        },
        {
            $match: searchQueryTime
        },
        {
            $project: {
                _id: 0,
                numberPlate: 1,
                registDate: 1,
                expiredDate: 1,
                city: 1,
                ownerName: "$owner.data.name",
                ownerSSN: "$owner.data.SSN",
                ownerPhone: "$owner.data.phone",
                ownerEmail: "$owner.email"
            }
        },
    ]).catch((err) => {
        return null;
    })
    return data;
}

module.exports = OfficeController;