const express = require('express')
const bodyParser = require('body-parser')

const placesRoutes = require('./routes/places-routes')

const app = express()

app.use('/api/places', placesRoutes)

app.use((error, request, response, next) => {
    if(response.headerSent){
        return next(error)
    }

    response.status(error.code || 500)
    response.json({message: error.message || 'An unknown error occured!'})
})

app.listen(5000)