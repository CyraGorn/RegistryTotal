const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CarOwners = require("./CarOwners");

const registrationCertSchema = new Schema({
	number: {
		type: Number,
		required: true,
		unique: true,
	},
	registrationDate: {
		type: Date,
		required: true,
	},
}, {
	collection: "Cars"
});

const specificationSchema = new Schema({
	wheelFormula: String,
	wheelTread: String,
	overallDimension: String,
	containerDimension: String,
	lengthBase: String,
	kerbMass: String,
	authorizedPayload: String,
	authorizedTotalMass: String,
	authorizedTowedMass: String,
	permissibleCarry: String,
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
	type: { type: String, required: true },
	brand: { type: String, required: true },
	modelCode: { type: String, required: true },
	engineNumber: { type: String, required: true },
	chassisNumber: { type: String, required: true },
	color: { type: String, required: true },
	manufacturedYear: { type: String, required: true },
	manufacturedCountry: { type: String, required: true },
	registrationCert: { type: registrationCertSchema, required: true },
	specification: { type: specificationSchema, required: true },
	boughtPlace: { type: String, required: true },
	purpose: { type: String, required: true },
}, {
	collection: "Cars"
});

module.exports = mongoose.model("Cars", carSchema);