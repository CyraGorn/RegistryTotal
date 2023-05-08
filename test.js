const mongoose = require("mongoose");
const CarOwners = require('./models/CarOwners');
const Cars = require('./models/Cars');
const Staff = require('./models/Staff');
const Registry = require('./models/Registry');
const RegistryOffice = require('./models/RegistryOffice');

mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.v8gw10b.mongodb.net/registrytotal?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

Staff.find({}).select("_id workFor").limit(10).then((data) => {
    console.log(data);
})