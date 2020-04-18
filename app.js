const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('dotenv').config()

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const HTTPError = require('./models/http-error')

const app = express()

const db_link = process.env.DB_LINK

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)

app.use((request, response, next) => {
    const error = new HTTPError('Could not find this route!', 404)
    throw error
})

app.use((error, request, response, next) => {
    if(response.headerSent){
        return next(error)
    }

    response.status(error.code || 500)
    response.json({message: error.message || 'An unknown error occured!'})
})

mongoose
    .connect(db_link, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {app.listen(5000)})
    .catch(error => {console.log(error)})
