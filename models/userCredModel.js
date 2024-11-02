const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
    city: {
        type: String
    },
    zipcode: {
        type: String
    },
    preference: {
        type: String
    },
    state: {
        type: String
    },
    skills: {
        type: [String]
    },
    availability: {
        type: String
    },
});

const userCredSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    details:
        userDetailsSchema
    ,
    isAdmin: {
        type: Boolean,
        required: true
    },
    notifs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'notifs'
    }],
    volHistory: {
        type: [String]
    }
});

const userDetails = new mongoose.model("userDetails", userDetailsSchema);
const userCollection = new mongoose.model("userCollection", userCredSchema);

module.exports = userCollection;