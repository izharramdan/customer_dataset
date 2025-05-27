const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    Number: Number,
    "Name of Location": String,
    Date: String,
    "Login Hour": String,
    Name: String,
    Age: Number,
    gender: String,
    Email: String,
    "No Telp": String,
    "Brand Device": String,
    "Digital Interest": String,
    "Location Type": String,
}, { collection: 'customers' });

module.exports = mongoose.model('Customer', CustomerSchema);
