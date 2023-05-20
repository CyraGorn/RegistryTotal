const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    SSN: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
}, {
    collection: "Person"
});

module.exports = mongoose.model("Person", personSchema);