const fs = require('fs')

const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const HTTPError = require('../models/http-error')
const getCoordinates = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user')


const getPlaceById = async (request, response, next) => {
    const placeId = request.params.pid

    let place
    try{ place = await Place.findById(placeId)}
        catch(err){
            const error = new HTTPError('Something went wrong! Could not find a place.', 500)
            return next(error)
        }

    if(!place){
        const error = new HTTPError('Could not find place!', 404)
        return next(error)
    }

    response.json({place: place.toObject({getters: true})})
}

const getPlacesByUser = async (request, response, next) => {
    const userId = request.params.uid

    let userPlaces
    try{ userPlaces = await User.findById(userId).populate('places') }
        catch(err){
            const error = new HTTPError('Could not find user!', 500)
            return next(error)
        }

    if(!userPlaces || userPlaces.places.length === 0){
        const error = new HTTPError('Could not find places for this user!', 404)
        return next(error)
    }

    response.json({places: userPlaces.places.map(place => place.toObject({getters: true}))})
}

const createPlace = async (request, response, next) => {
    
    const errors = validationResult(request)
    if(!errors.isEmpty()){
        console.log(errors)
        return next(new HTTPError('Invalid inputs', 422))
    }
    const { title, description, address, creator } = request.body

    let coordinates
    try {coordinates = await getCoordinates(address)} catch(error){return next(error)}

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: request.file.path,
        creator
    })

    let user

    try{ user = await User.findById(creator) } catch (err) {
        const error = new HTTPError('Failed to create a new place.', 500)
        return next(error)
    }

    if(!user){
        const error = new HTTPError('Could not find user!', 404)
        return next(error)
    }

    try { 
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({session: sess})

        user.places.push(createdPlace)
        await user.save({session: sess})
        await sess.commitTransaction()

     } catch(err) {
        const error = new HTTPError('Failed to create a new place', 500)
        return next(error)
    }

    response.status(201).json({place: createdPlace})
}

const updatePlace = async (request, response, next) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        console.log(errors)
        return next(new HTTPError('Invalid inputs', 422))
    }

    const { title, description } = request.body
    const placeId = request.params.pid

    let place
    try { place = await Place.findById(placeId)}
        catch(err){
            const error = new HTTPError('Something went wrong! Could not update place.', 500)
            return next(error)
        }

    place.title = title
    place.description = description

    try { await place.save()}
        catch(err){
            const error = new HTTPError('Something went wrong! Could not update place.', 500)
            return next(error)
        }

    response.status(200).json({place: place.toObject({getters: true})})
}

const deletePlace = async (request, response, next) => {
    const placeId = request.params.pid

    let place

    try { place = await Place.findById(placeId).populate('creator') } catch(err){
        const error = new HTTPError('Something went wrong! Could not delete place.', 500)
        return next(error)
    }
    
    if(!place){
        const error = HTTPError('Could not find place!', 404)
        return next(error)
    }

    const imagePath = place.image

    
    try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await place.remove({session: session})

        place.creator.places.pull(place)
        await place.creator.save({session: session})
        await session.commitTransaction()

    } catch(err){
        const error = new HTTPError('Something went wrong! Could not delete place.', 500)
        return next(error)
    }

    fs.unlink(imagePath, error => {return next(error)} )

    response.status(200).json({message: 'Deleted place!'})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUser = getPlacesByUser
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace