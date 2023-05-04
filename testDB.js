const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const AccountSchema = new Schema({
    email: String,
    password: String
}, {
    collection: "account"
});

const AccountModel = mongoose.model("account", AccountSchema);

module.exports = AccountModel;