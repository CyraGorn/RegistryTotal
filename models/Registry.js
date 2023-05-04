const mongoose = require("mongoose");

const car = require("./Cars");
const Staff = require("./Staff");

const registrySchema = new mongoose.Schema({
	regisPlace: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Staff",
	},
	car: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Cars",
	},
	regisDate: {
		type: Date,
		default: Date.now,
		required: true,
	},
	expiredDate: {
		type: Date,
		required: true,
	},
}, {
	collection: "Registry"
});

module.exports = mongoose.model("Registry", registrySchema);