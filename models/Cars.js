const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CarOwners = require("./CarOwners");

const specificationSchema = new Schema({
    wheelFormula: String,
    wheelTread: String,
    overallDimension: String,
    luggageContainer: String,
    wheelBase: String,
    kerbMass: String,
    authorizedPayload: String,
    authorizedTotalMass: String,
    authorizedTowedMass: String,
    carriedNo: Number,
    fuel: String,
    engineDisplacement: String,
    maxOutputToRpmRatio: String,
    numberOfTiresAndTireSize: String,
}, {
    collection: "Cars"
});

const carSchema = new Schema({
    numberPlate: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "CarOwners" },
    registry: [{ type: mongoose.Schema.Types.ObjectId, ref: "Registry" }],
    type: { type: String, required: true },
    mark: { type: String, required: true },
    modelCode: { type: String, required: true },
    engineNumber: { type: String, required: true },
    chassisNumber: { type: String, required: true },
    manufacturedYear: { type: Number, required: true },
    manufacturedCountry: { type: String, required: true },
    specification: { type: specificationSchema, required: true },
    boughtPlace: {
        type: String,
        required: true
    },
    purpose: { type: String, required: true },
    certificate: {
        certDate: {
            type: Date,
            required: true
        },
        certNum: {
            type: String,
            required: true,
            unique: true
        },
    }
}, {
    collection: "Cars"
});

module.exports = mongoose.model("Cars", carSchema);