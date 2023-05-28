const OfficeModel = require('../models/RegistryOffice');
const RegistryModel = require('../models/Registry');
const CarsModel = require('../models/Cars');
const ObjectId = require('mongoose').Types.ObjectId;

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
            .select("regisNum car regisDate expiredDate city").populate({
                path: "car",
                populate: {
                    path: "owner",
                    select: "email data.name data.dateOfBirth data.SSN data.phone"
                },
                select: "numberPlate owner"
            }).then((data) => {
                return res.status(200).json(data);
            }).catch((err) => {
                return res.status(500).json("SERVER UNAVAILABLE");
            })
    }

    static async getCarRegisted(req, res) {
        let result = req.result;
        let id = req.params.id;
        let time = req.body.time;
        let city = req.body.city;
        let workingCity = await OfficeModel.findOne({
            _id: result['id']
        }).select("city").catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        if (result === undefined || id === undefined || time === undefined
            || isNaN(time) || city === undefined || typeof (city) !== "string"
            || (result['isAdmin'] !== 1 && city !== "" && city != workingCity['city'])) {
            return res.status(404).json("NOT FOUND");
        } else {
            try {
                var searchQuery = {
                    regisPlace: new ObjectId(id),
                    regisDate: {
                        $gte: new Date(Number(time), 0, 1),
                        $lt: new Date(Number(time) + 1, 0, 1)
                    }
                };
                if (id === result['workFor'] && result['isAdmin'] === 1) { // all office
                    delete searchQuery['regisPlace'];
                    if (city !== "") {
                        searchQuery['city'] = city;
                    }
                }
                RegistryModel.aggregate([
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
                    }, {
                        $sort: {
                            _id: 1,
                            month: 1
                        }
                    },
                ]).then((data) => {
                    let sum = 0;
                    for (var i = 0; i < data.length; i++) {
                        sum += data[i]['count']
                    }
                    return res.status(200).json({ year: time, total: sum, data: data });
                })
            } catch {
                return res.status(404).json("NOT FOUND")
            }
        }
    }

    static async getCarOutDate(req, res) {
        let result = req.result;
        let id = req.params.id;
        let status = req.body.status
        let city = req.body.city;
        let workingCity = await OfficeModel.findOne({
            _id: result['id']
        }).select("city").catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        if (result === undefined || id === undefined || status === undefined
            || (status !== "soon" && status !== "expired")
            || city === undefined || typeof (city) !== "string"
            || (result['isAdmin'] !== 1 && city !== "" && city != workingCity['city'])) {
            return res.status(404).json("NOT FOUND");
        } else {
            try {
                var now = new Date();
                var expireThisMonth = new Date();
                expireThisMonth.setMonth(now.getMonth() + 1);
                var searchQueryPlace = {
                    "registry.regisPlace": new ObjectId(id),
                };
                var searchQueryTime = {};
                if (status === "soon") {
                    searchQueryTime["expiredDate"] = {
                        $gte: now,
                        $lt: expireThisMonth
                    }
                } else if (status === "expired") {
                    searchQueryTime["expiredDate"] = {
                        $lte: now,
                    }
                }
                if (id === result['workFor'] && result['isAdmin'] === 1) { // all office
                    delete searchQueryPlace['registry.regisPlace'];
                    if (city !== "") {
                        searchQueryPlace["registry.city"] = city;
                    }
                } // 4554 492
                CarsModel.aggregate([
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
                ]).then((data) => {
                    let length = data.length
                    return res.status(200).json({ total: length, data: data });
                })
            } catch {
                return res.status(404).json("NOT FOUND")
            }
        }
    }
}

module.exports = OfficeController;