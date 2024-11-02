const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    preference: {
        type: String
    },
    state: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
});

const userDetails = new mongoose.model("userDetails", userDetailsSchema);

module.exports = userDetails;