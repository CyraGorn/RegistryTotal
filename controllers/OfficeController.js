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