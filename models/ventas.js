const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   
    noFactura: {
        type: Number,
        required: true

    },
    fecha: {
        type: String,
        required: true
    },
    idClient: {
        type: mongoose.Types.ObjectId,    
        required: true,
        
    },
    idUser: {
        type: mongoose.Types.ObjectId,  
        required: true,
        
    },
    estado: {
        type: String,
        required: true,
        
    },
    totalFactura:{
        type: Number,
        required: true,
    }

  
})

module.exports = mongoose.model('Ventas', userSchema)