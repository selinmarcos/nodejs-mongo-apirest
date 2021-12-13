const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
mongoose.set('useCreateIndex', true)
// mongoose.connect('mongodb://localhost:27017/node_auth', {
// mongoose.connect('mongodb+srv://markselin:MarcoS_1683947_@cluster0.uaau3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
mongoose.connect('process.env.CONNECT_MONGO', {
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, () => {
    console.log('connected to the database')
})

const routes = require('./routes/routes')

app = express()

app.use(cookieParser())
app.use(cors({

    credentials: true,
    origin: ['http://localhost:8000', 'http://localhost:8080']
}))

app.use(express.json())

app.use('/api', routes)
//de esta forma cuando se ejecute localmente 8000 sera el puerto y tambien funcionara en heroku al hacer deploy
app.listen(process.env.PORT || 8000)
