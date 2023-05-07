const mongoose = require("mongoose");

try {
    mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.v8gw10b.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("fadsafd")
} catch (err) {
    console.log(err);
}
