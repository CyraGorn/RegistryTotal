const mongoose = require("mongoose");

const registrySchema = new mongoose.Schema({
    regisNum: {
        type: String,
        unique: true
    },
    city: {
        type: String,
        require: true
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