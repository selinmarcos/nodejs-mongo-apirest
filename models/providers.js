const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        
        required: true
    },
    phone: {
        type: Number,
        required: true,
        
    },
    direccion: {
        type: String,
        required: true,
        
    },

  
})

module.exports = mongoose.model('Providers', userSchema)