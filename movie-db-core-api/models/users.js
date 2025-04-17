const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    authMethod: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Users', usersSchema)