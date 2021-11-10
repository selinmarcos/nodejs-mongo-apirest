const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    user: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },

    pass: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)
