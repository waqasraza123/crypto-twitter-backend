const mongoose = require("mongoose")

//create tweets schema
//very basic for now
const tweets = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
        default: 1
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
 * create post model - similar to eloquent models
 * first argument : name of the model
 * second argument : schema object
 */
module.exports = mongoose.model('Tweet', tweets);
