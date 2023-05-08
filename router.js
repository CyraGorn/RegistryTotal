const express = require('express');
const RestrictAPI = require('./middleware/RestrictAPI.js');
const StaffModel = require('./models/Staff.js');
const OfficeModel = require('./models/RegistryOffice.js');
const OwnerModel = require('./models/CarOwners.js');
const AuthMiddleware = require('./middleware/AuthMiddleware.js');
const jwt = require('./helpers/JWTHelper.js');
var router = express.Router();

const PAGE_SIZE = 100;

router.get('/staff', AuthMiddleware, (req, res) => {
    var token = req.cookies.session;
    var kq = jwt.verify(token).then((kq) => {
        StaffModel.findOne({
            email: kq['user']
        }).populate('workFor').then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(500).json("SERVER ERROR")
        })
    });
    // var index = req.query.index;
    // index = Number(index);
    // if (!isNaN(index) && index >= 1) {
    //     var skipIndex = (index - 1) * PAGE_SIZE;
    //     StaffModel.find({

    //     }).skip(skipIndex).limit(PAGE_SIZE).populate('workFor').then((data) => {
    //         res.json(data);
    //     }).catch((err) => {
    //         res.status(500).json("Unexpected Error: " + err);
    //     })
    // } else {
    //     StaffModel.find({

    //     }).populate('workFor').then((data) => {
    //         res.json(data);
    //     }).catch((err) => {
    //         res.status(500).json("Unexpected Error: " + err);
    //     })
    // }
});

router.get('/office/:id', (req, res) => {
    var id = req.params.id;
    OfficeModel.findById(id)
});

router.get('/car', (req, res) => {

})

module.exports = router;