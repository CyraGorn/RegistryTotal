const RegistryModel = require('../models/Registry');
const ObjectId = require('mongoose').Types.ObjectId;

class InspectController {
    static getById(req, res) {
        RegistryModel.findOne({
            _id: req.params.id
        }).select("regisStaff regisPlace regisNum car regisDate expiredDate").populate("car").then((data) => {
            return res.status(200).json(data);
        }).catch((err) => {
            return res.status(404).json("NOT FOUND");
        });
    }

    static createInspection(req, res) {

    }
}

module.exports = InspectController;