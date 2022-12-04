const mongoose = require("mongoose")
const {Schema} = require("mongoose");

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
    username: {
        type: String,
        required: true,
        lowercase: true,
        maxLength: 20
    },
    bio: {
        type: String,
        required: false,
        maxLength: 200
    },
    photo: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    tweets: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

//exclude the password field
users.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})


/**
 *
 * create user model - similar to eloquent models
 * first argument : name of the model
 * second argument : schema object
 */
module.exports = mongoose.model('User', users);
