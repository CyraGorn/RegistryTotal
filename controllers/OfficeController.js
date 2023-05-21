const OfficeModel = require('../models/RegistryOffice');
const RegistryModel = require('../models/Registry');
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
            console.log(err);
            return res.status(500).json("SERVER UNAVAILABLE");
        });
    }

    static getCarRegisted(req, res) {
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
                return res.status(500).json("SERVER UNAVAILABLE");
            });
        }
    }

    static getCarOutDate(req, res) {
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
            RegistryModel.aggregate([
                {
                    $match: searchQuery
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
                    $sort: {
                        "regisDate": -1
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
                return res.status(500).json("SERVER UNAVAILABLE");
            });
        }
    }
}

module.exports = OfficeController;