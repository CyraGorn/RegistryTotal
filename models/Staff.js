const mongoose = require("mongoose");
const Person = require("./Person");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const StaffSchema = new mongoose.Schema({
    data: {
        type: Person.schema,
    },
    isAdmin: Number,
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
            message: (props) => "Invalid email address",
        },
    },
    password: {
        type: String,
        required: true,
    },
    workFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistryOffice"
    }
}, {
    collection: "Staff"
});

// StaffSchema.pre("save", function (next) {
//     var user = this;
//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified("password")) return next();
//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) return next(err);
//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, function (err, hash) {
//             if (err) return next(err);
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

StaffSchema.methods.comparePassword = function (
    candidatePassword,
    cb
) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("Staff", StaffSchema);