const mongoose = require("mongoose")

//create user schema
const users = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
});

/**
 *
 * create user model - similar to eloquent models
 * first argument : name of the model
 * second argument : schema object
 */
module.exports = mongoose.model('User', users);
