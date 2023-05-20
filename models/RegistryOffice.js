const mongoose = require("mongoose");
const Staff = require("./Staff");

const registryOfficeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    city: {
        type: String,
        required: true,
    },
    cityCode: Number,
    isAdmin: Number,
    address: {
        type: String,
        required: true,
    },
    hotline: {
        type: String,
        required: true,
        unique: true,
        immutable: true,
        defaut: {},
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