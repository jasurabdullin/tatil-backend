const express = require('express')

const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places-routes')
const HTTPError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placesRoutes)

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

app.listen(5000)