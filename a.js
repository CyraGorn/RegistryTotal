require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var rand = require('random-seed').create();
const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));
const Staff = require('./models/Staff')
console.log(process.env.MONGO_USERNAME)