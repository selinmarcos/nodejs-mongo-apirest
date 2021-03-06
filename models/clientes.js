const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        //default: 'REGULAR',
        //required: true
    },
    nit: {
        type: Number,
        //default:'0',
        required: true,
        unique: true
    },
    telefono: {
        type: Number,
        //default:'0',
        //required: true,
        
    },
    direccion: {
        type: String,
        //default:'NN',
        //required: true,
        
    }
    

  
},
    {
        timestamps:true  ,  //AGREGAR FECHAS
        versionKey: false
    }
)

module.exports = mongoose.model('Clientes', userSchema)