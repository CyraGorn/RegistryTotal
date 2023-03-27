const mongoose = require("mongoose");
const Person = require("./Person");
const Center = require("./RegistryCentre");
const CenterStaff = require("./CentreStaff");
const SALT_WORK_FACTOR = 10;

const DepartmentStaffSchema = new mongoose.Schema({
	data: {
		type: Person.schema,
	},
	email: {
		type: String,
		required: [true, "Email required"],
		unique: true,
		validate: {
			validator: function (v) {
				var emailRegex =
					/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
				return emailRegex.test(v);
			},
			message: (props) => `${props.value} is not a valid email address`,
		},
	},
	password: {
		type: String,
		required: true,
	},
}, {
	collection: "DepartmentStaff"
});

DepartmentStaffSchema.pre(save, function (next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

DepartmentStaffSchema.methods.comparePassword = function (
	candidatePassword,
	cb
) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.Model("DepartmentStaff", DepartmentStaffSchema);
