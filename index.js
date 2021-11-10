const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017/node_auth', {
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

app.listen(8000)
