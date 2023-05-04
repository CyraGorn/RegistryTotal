const mongoose = require("mongoose");
const Staff = require("./Staff");

const registryOfficeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: Number,
    address: {
        type: String,
        required: true,
        // unique: true,
    },
    hotline: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
        defaut: {},
        validation: {
            validators: function (v) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: (props) => "Invalid phone number!"
        },
    },
    hotMail: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
        default: {},
    },
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: "Staff" }],
}, {
    collection: "RegistryOffice"
});

module.exports = mongoose.model("RegistryOffice", registryOfficeSchema);