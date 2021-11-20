const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nit: {
        type: Number,
        required: true
    },
    phone: {
        type: Number,
        
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    companyName: {
        type: String,
        required: true,
        
    },
    companyLegalName: {
        type: String,
        required: true,
        
    },
    address: {
        type: String,
        required: true,
        
    },
    city: {
        type: String,
        required: true,
        
    },
    country: {
        type: String,
        required: true,
        
    },
    iva: {
        type: Number,
        required: true,
        
    },

  
})

module.exports = mongoose.model('Business', userSchema)