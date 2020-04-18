const {v4: uuidv4 } = require('uuid')

const HTTPError = require('../models/http-error')

let DUMMYPLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    }
]

const getPlaceById = (request, response, next) => {
    const placeId = request.params.pid
    const place = DUMMYPLACES.find(p => {return p.id === placeId})

    if(!place){
        throw new HTTPError('Could not find place!', 404)
    }

    response.json({place})
}

const getPlacesByUser = (request, response, next) => {
    const userId = request.params.uid
    const places = DUMMYPLACES.filter(p => {return p.creator === userId})

    if(!places || places.length === 0){
        throw new HTTPError('Could not find places for this user!', 404)
    }


    response.json({places})
}

const createPlace = (request, response, next) => {
    const { title, description, coordinates, address, creator } = request.body

    const createdPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMYPLACES.push(createdPlace)

    response.status(201).json({place: createdPlace})
}

const updatePlace = (request, response, next) => {
    const { title, description } = request.body
    const placeId = request.params.pid
    const updatedPlace = { ...DUMMYPLACES.find(p => p.id === placeId) }
    const placeIndex = DUMMYPLACES.findIndex(p => p.id === placeId)
    updatedPlace.title = title
    updatedPlace.description = description

    DUMMYPLACES[placeIndex] = updatedPlace

    response.status(200).json({place: updatedPlace})
}

const deletePlace = (request, response, next) => {
    const placeId = request.params.pid

    DUMMYPLACES = DUMMYPLACES.filter(p => p.id !== placeId)

    response.status(200).json({message: 'Deleted place!'})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUser = getPlacesByUser
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace