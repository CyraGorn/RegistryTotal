const RegistryModel = require('../models/Registry');
const CarsModel = require('../models/Cars');
const OwnerModel = require('../models/CarOwners');
const InspectionCalculation = require('../utils/InspectionCalculate');
const ObjectId = require('mongoose').Types.ObjectId;

class InspectController {
    static getById(req, res) {
        RegistryModel.findOne({
            regisNum: req.params.id
        }).select("regisStaff regisPlace regisNum car regisDate expiredDate").populate("car").then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
    }

    static async createInspection(req, res) {
        let alldata = req.alldata;
        let result = req.result;
        let existOwner = await InspectionCalculation.insertOwner(alldata['owner']);
        if (!existOwner) {
            return res.status(500).json("SERVER UNAVAILABLE");
        }
        alldata['owner'] = existOwner['_id'];
        let existCar = await InspectionCalculation.insertCar(alldata);
        if (!existCar) {
            return res.status(500).json("SERVER UNAVAILABLE");
        }
        let expiredDate = InspectionCalculation.generateExpireDate(alldata);
        let regisNum = await InspectionCalculation.generateRegisNum();
        if (!regisNum) {
            console.log(1234)
            return res.status(500).json("SERVER UNAVAILABLE");
        }
        let newReg = RegistryModel.create({
            regisNum: regisNum,
            regisStaff: result['id'],
            regisPlace: result['workFor'],
            car: existCar['_id'],
            regisDate: new Date(),
            expiredDate: expiredDate
        }).then((data) => {
            return res.status(200).json({
                status: "SUCCEEDED",
                regisNum: regisNum
            });
        }).catch((err) => {
            console.log(err)
            return res.status(500).json("SERVER UNAVAILABLE");
        })
    }
}

module.exports = InspectController;