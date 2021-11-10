const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   
    idProduct: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    idVenta: {
        type: mongoose.Types.ObjectId,
    
    },
    cantidad: {
        type: Number,
        required: true
    },
    precioVenta: {
        type: Number,    
        required: true,
        
    }

})

module.exports = mongoose.model('detalleVenta', userSchema)