const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        
        required: true
    },
    price: {
        type: Number,
        required: true,
        
    },
    idProvider: {
        type: String,
        required: true,
        
    },

  
})

module.exports = mongoose.model('Products', userSchema)