const mongoose = require("mongoose");
const Person = require("./Person");
const RegistryCentre = require("./RegistryCentre");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const centreStaffSchema = new mongoose.Schema({
	Info: {
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
	workedFor: {
		type: mongoose.Schema.Types.ObjectID,
		ref: "RegistryCentre",
	},
	password: {
		type: String,
		required: true,
	},
}, {
	collection: "CentreStaff"
});

centreStaffSchema.pre("save", function (next) {
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

centreStaffSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model("centreStaff", centreStaffSchema);
// Method create centreStaff
// centreStaffSchema.createcentreStaff = async () => {
//   const user = new centreStaff({
//     info: new Person({
//       Name: "Phạm Văn Thạch",
//       DateOfBirth: "2003-11-23",
//       SSN: 187896630,
//       Phone: 0889826866,
//     }),
//     email: "phamvanthach2003@gmail.com",
//     password: "thachhaha123",
//   });
//   const centre = await RegistryCentre.findOne({ name: "HanoiRegistry" });
//   user.workedFor = centre.ObjectID;
//   user
//     .save()
//     .then((data) => {
//       console.log("centreStaff added");
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log("Errror!!!!");
//       console.log(err);
//     });
// };


