const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Cars = require("./Cars");
const RegistryOffice = require("./RegistryOffice");
const regisStaff = require("./Registry");

const outDateCarsSchema = new Schema({
    regisPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistryOffice",
        require: true
    },
    registryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Registry",
        require: true
    },
    carID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cars",
        require: true
    },
    status: String
}, {
    collection: "OutDateCars"
});

module.exports = mongoose.model("OutDateCars", outDateCarsSchema);