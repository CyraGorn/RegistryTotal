const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const OwnerModel = require('./models/CarOwners.js');
const RegistryModel = require('./models/Registry.js');
const AuthMiddleware = require('./middleware/AuthMiddleware.js');
const jwt = require('./helpers/JWTHelper.js');
var router = express.Router();

const PAGE_SIZE = 100;

router.get('/staff', (req, res) => {
    var token = req.cookies.session;
    var kq = jwt.verify(token).then((kq) => {
        StaffModel.findOne({
            email: kq['user']
        }).select("data isAdmin email workFor").populate('workFor').then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(500).json("SERVER ERROR");
        })
    });
});

const ObjectId = require('mongoose').Types.ObjectId;
router.get('/office', (req, res) => { //office/:id
    // var id = req.params.id;
    OfficeModel.findById(new ObjectId('645863ad633f1e6a4f0972d5')).then((off) => {
        res.status(200).json(off);
    }).catch((err) => {
        console.log(err);
        res.status(500).json("SERVER ERROR");
    })
});

router.get('/office/car', (req, res) => { //office/:id/car
    // var id = req.params.id;
    RegistryModel.find({
        regisPlace: new ObjectId("645863ad633f1e6a4f097333")
    }).select("regisStaff car regisDate expiredDate").populate("car").populate({
        path: "regisStaff",
        select: "data isAdmin email"
    }).then((data) => {
        console.log(data);
        res.status(200).json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).json("SERVER ERROR");
    })
})



module.exports = router;