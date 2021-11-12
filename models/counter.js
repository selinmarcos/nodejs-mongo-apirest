const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   
    id:{

    },
    sequence_value:{
 
    }

  
})

module.exports = mongoose.model('Counter', userSchema)