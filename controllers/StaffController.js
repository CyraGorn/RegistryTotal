const StaffModel = require('../models/Staff');
const OfficeModel = require('../models/RegistryOffice');
const TokenModel = require('../models/Token');
const sendEmail = require("../utils/email/sendEmail");
const crypto = require("crypto");
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
        }).select("_id data email isAdmin workFor registed").populate({
            path: "workFor",
            select: "_id name address city"
        }).populate({
            path: "registed",
            populate: {
                path: "car",
                select: "numberPlate"
            },
            select: "regisNum regisDate car"
        }).then((data) => {
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
            select: "regisNum regisDate"
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
            select: "regisNum regisDate"
        }).then(async (data) => {
            res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        });
    }

    static async addStaff(req, res) {
        var staff = await StaffModel.create({
            data: {
                name: req.body.name,
                dateOfBirth: req.body.dob,
                SSN: req.body.ssn,
                phone: req.body.phone
            },
            isAdmin: Number(req.body.isAdmin),
            email: req.body.email,
            password: req.body.password,
            workFor: req.officeid,
        }).catch((err) => {
            console.log(err);
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

    static async changePassword(req, res) {
        let newPass = req.body.newpass;
        let result = req.result;
        let user = await StaffModel.findOne({ _id: result['id'] }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        user['password'] = newPass;
        user.save().then((data) => {
            return res.status(200).json("Password reset Successfully");
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
    }

    static async forgotPassword(req, res) {
        let email = req.body.email;
        let user = await StaffModel.findOne({
            email: email
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        if (!user) {
            return res.status(404).json("NOT FOUND");
        }
        let token = await TokenModel.findOne({
            userId: user['_id']
        }).catch((err) => {
            return res.status(500).json('SERVER UNAVAILABLE');
        });
        if (token) {
            await TokenModel.deleteOne({ _id: token['_id'] }).catch((err) => {
                return res.status(500).josn("SERVER UNAVAILABLE");
            });
        }
        let resetToken = crypto.randomBytes(40).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);
        await new TokenModel({
            userId: user['_id'],
            name: user.data.name,
            token: hash,
            createdAt: Date.now()
        }).save();
        const resetLink = `registrytotal.herokuapp.com/reset-password/${resetToken}?userid=${user['_id']}`;
        sendEmail(
            user['email'],
            "Password reset Request",
            { name: user.data.name, link: resetLink },
            "./requestResetPassword.handlebars"
        );
        return res.status(200).json("Password reset request has been sent to your email!");
    }

    static async resetPassword(req, res) {
        let token = req.params.token;
        let newPass = String(req.body.newpassword);
        let existToken = req.existToken;
        let user = await StaffModel.findOne({ _id: existToken['userId'] }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        user['password'] = newPass;
        await user.save().catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        sendEmail(
            user['email'],
            "Password reset Successfully",
            { name: user.data.name, },
            "./resetPassword.handlebars"
        );
        await TokenModel.deleteOne({
            token: existToken['token']
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        })
        return res.status(200).json("Password reset Successfully");
    }
}

module.exports = StaffController;