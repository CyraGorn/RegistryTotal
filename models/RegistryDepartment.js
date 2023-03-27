const mongoose = require('mongoose');
const DepartmentStaff = require('./Departmentstaff');

const RegistryDepartmentSchema = new mongoose.schema({
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
		type: string,
		required: true,
		unique: true,
		immutable: true,
		default: "registrytotal@vr.com.vn"
	},
	Staff: [{ type: mongoose.Schema.Types.ObjectID, ref: "DepartmentStaff" }]

}, {
	collection: "RegistryDepartment"
});

module.exports = mongoose.model("RegistryDepartment", RegistryDepartmentSchema);