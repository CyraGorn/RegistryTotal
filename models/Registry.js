const mongoose = require("mongoose");

const car = require("./Cars");
const Staff = require("./Staff");

const registrySchema = new mongoose.Schema({
    regisNum: {
        type: String,
        unique: true
    },
    regisStaff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Staff",
    },
    regisPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistryOffice",
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cars",
    },
    regisDate: {
        type: Date,
        required: true,
    },
    expiredDate: {
        type: Date,
        required: true,
    }
}, {
    collection: "Registry"
});

module.exports = mongoose.model("Registry", registrySchema);