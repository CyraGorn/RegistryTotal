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
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    workFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistryOffice"
    },
    registed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Registry" }]
}, {
    collection: "Staff"
});

StaffSchema.pre("save", function (next) {
    var user = this;
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model("Staff", StaffSchema);