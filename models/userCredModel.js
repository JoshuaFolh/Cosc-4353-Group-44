const mongoose = require('mongoose');

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
    details: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDetails'
    }],
    isAdmin: {
        type: Boolean,
        required: true
    }
});

const userCollection = new mongoose.model("userCollection", userCredSchema);

module.exports = userCollection;