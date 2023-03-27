const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
	Name: { type: String, required: true },
	DateOfBirth: { type: Date, required: true },
	SSN: { type: Number, required: true, unique: true },
	Phone: { type: Number, required: true, unique: true },
}, {
	collection: "Person"
});

module.exports = mongoose.model("Person", PersonSchema);