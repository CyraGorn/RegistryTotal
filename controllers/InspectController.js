const RegistryModel = require('../models/Registry');
const CarsModel = require('../models/Cars');
const OwnerModel = require('../models/CarOwners');
const StaffModel = require('../models/Staff');
const InspectionCalculation = require('../utils/InspectionCalculate');
const ObjectId = require('mongoose').Types.ObjectId;

class InspectController {
    static getById(req, res) {
        // lấy thông tin đăng kiểm (thông tin xe, chủ xe, ngày đăng kiểm
        // ngày hết hạn, nhân viên đăng kiểm) qua id (regisNum)
        RegistryModel.findOne({
            regisNum: req.params.id
        }).select("regisStaff regisPlace regisNum car regisDate expiredDate").populate([{
            path: "car",
            populate: {
                path: "owner"
            },
        }, {
            path: "regisStaff",
            select: "data email"
        }, {
            path: "regisPlace",
            select: "name city address"
        }]).then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
    }

    static getCarByPlate(req, res) { // lấy thông tin xe, chủ xe thông qua biển xe
        if (!req.body.plate || typeof (req.body.plate) !== "string") {
            return res.status(404).json("NOT FOUND");
        }
        let plate = req.body.plate;
        CarsModel.findOne({
            numberPlate: plate
        }).populate("owner").populate({
            path: "registry",
            populate: [{
                path: "regisStaff",
                select: "data email"
            }, {
                path: "regisPlace",
                select: "name"
            }],
            select: "regisStaff regisPlace regisDate expiredDate regisNum"
        }).then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        })
    }

    static async createInspection(req, res) { // tạo đăng kiểm mới
        let alldata = req.alldata;
        let result = req.result;

        // kiểm tra chủ xe đã có trong db chưa, nếu chưa thì thêm vào
        let existOwner = await InspectionCalculation.insertOwner(alldata['owner']);
        if (!existOwner) {
            return res.status(500).json("SERVER UNAVAILABLE");
        }
        alldata['owner'] = existOwner['_id'];

        // kiểm tra xe đã có trong db chưa, nếu chưa thì thêm vào
        let existCar = await InspectionCalculation.insertCar(alldata);
        if (!existCar) {
            return res.status(500).json("SERVER UNAVAILABLE");
        }

        // tính toán ngày hết hạn dựa vào các thông tin của xe
        let expiredDate = InspectionCalculation.generateExpireDate(alldata);
        let regisNum = await InspectionCalculation.generateRegisNum();
        if (!regisNum) {
            return res.status(500).json("SERVER UNAVAILABLE");
        }
        let newReg = await RegistryModel.create({
            regisNum: regisNum,
            regisStaff: result['id'],
            regisPlace: result['workFor'],
            car: existCar['_id'],
            regisDate: new Date(),
            expiredDate: expiredDate
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        await CarsModel.updateOne({
            numberPlate: existCar['numberPlate']
        }, {
            $push: {
                registry: newReg['_id']
            }
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        await StaffModel.updateOne({
            _id: result['id']
        }, {
            $push: {
                registed: newReg['_id']
            }
        }).catch((err) => {
            return res.status(500).json("SERVER UNAVAILABLE");
        });
        return res.status(200).json({
            status: "SUCCEEDED",
            regisNum: regisNum
        });
    }
}

module.exports = InspectController;
