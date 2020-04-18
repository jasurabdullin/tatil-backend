const axios = require('axios')

const HTTPError = require('../models/http-error')

const API_KEY = 'AIzaSyBMxyebrSMAktk_qSl9YtH6YUAFpPJ1Kjk'

const getCoordinates = async (address) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)

    const data = response.data

    if(!data || data.status === 'ZERO_RESULTS'){
        const error = new HTTPError('Could not find location for specified address', 404)
        throw error
    }

    const coordinates = data.results[0].geometry.location

    return coordinates
}

module.exports = getCoordinates