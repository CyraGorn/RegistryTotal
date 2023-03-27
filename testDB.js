const mongoose = require("mongoose");

const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const car = new Schema({
    name: String
}, {
    collection: "Cars"
});

const CarModel = mongoose.model("Cars", car);

// CarModel.create({
//     name: "testvcl2vcl"
// });

CarModel.find({

})
    .then(function (data) {
        console.log(data);
    }).catch(function (err) {
        console.log(err);
    }) 