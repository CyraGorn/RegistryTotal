const mongoose = require("mongoose");
const CenterStaff = require("./CentreStaff");

const RegistryCenterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	Address: {
		type: String,
		required: true,
		unique: true,
	},
	Hotline: {
		type: Number,
		required: true,
		unique: true,
		immutable: true,
		defaut: {},
		validation: {
			validators: function (v) {
				return /\d{3}-\d{3}-\d{4}/.test(v);
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
	},
	hotMail: {
		type: String,
		required: true,
		unique: true,
		immutable: true,
		default: {},
	},
	Staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "CenterStaff" }],
}, {
	collection: "RegistryCentre"
});

module.exports = mongoose.model("RegistryCenter", RegistryCenterSchema);