const StaffModel = require('../models/Staff');
const OfficeModel = require('../models/RegistryOffice');
const bcrypt = require('bcrypt');
const jwt = require('../utils/JWTHelpers');
const ObjectId = require('mongoose').Types.ObjectId;

class StaffController {
    static async login(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        try {
            const user = await StaffModel.findOne({
                email: email
            });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!user || !isMatch) {
                res.status(422).json({ error: 'Invalid email or password' });
            } else {
                var token = jwt.sign({
                    id: user._id,
                    user: user.email,
                    isAdmin: user.isAdmin,
                    workFor: user.workFor
                });
                let data = {
                    session: token
                }
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(422).json({ error: 'Invalid email or password' });
        }
    }

    static getById(req, res) {
        StaffModel.findOne({
            _id: new ObjectId(req.params.id)
        }).populate("workFor").then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        })
    }

    static getAllStaff(req, res) {
        StaffModel.find({

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
            select: "_id regisDate"
        }).then((data) => {
            var returnData = {
                length: data.length,
                data: data
            }
            return res.status(200).json(returnData);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        });
    }

    static getOwnInfo(req, res) {
        StaffModel.findOne({
            email: req.result['user']
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
            select: "_id regisDate"
        }).then(async (data) => {
            res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        });
    }

    static async addStaff(req, res) {
        var staff = await StaffModel.create({
            data: {
                name: req.name,
                dateOfBirth: req.body.dob,
                SSN: req.body.ssn,
                phone: req.body.phone
            },
            isAdmin: Number(req.body.isAdmin),
            email: req.body.email,
            password: req.body.password,
            workFor: req.officeid,
        }).catch((err) => {
            return res.status(500).json("User already existed");
        });
        OfficeModel.findByIdAndUpdate(req.officeid, {
            $push: {
                staff: staff['_id']
            }
        }).then(() => {
            return res.status(200).json("SUCCEEDED");
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
    }

    static changeInfo(req, res) {
        let result = req.result;
        StaffModel.findByIdAndUpdate(result['id'], {
            data: {
                name: req.name,
                dateOfBirth: req.body.dob,
                SSN: req.body.ssn,
                phone: req.body.phone
            },
            email: req.body.email
        }).then((data) => {
            if (data) {
                return res.status(200).json("SUCCEEDED");
            }
        }).catch((err) => {
            return res.status(500).json("DUPLICATE DATA");
        });
    }
}

module.exports = StaffController;