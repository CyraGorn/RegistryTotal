const mongoose = require('mongoose');
const Person = require('./Person');
const Cars = require('./Cars');
const carOwnerSchema = new mongoose.Schema({
    data: {
        type: Person.schema
    },
    email: { type: String, required: true, unique: true },
    OwnedCar: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cars" }]
}, {
    collection: "CarOwners"
})

module.exports = mongoose.model('CarOwners', carOwnerSchema);
