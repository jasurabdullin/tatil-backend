const HTTPError = require('../models/http-error')

const DUMMYPLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world',
        image: "https://cdn.getyourguide.com/img/location_img-2608-1226636435-148.jpg",
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9856644
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Emp. State Building',
        description: 'One of the most famous sky scrapers in the world',
        image: "https://cdn.getyourguide.com/img/location_img-2608-1226636435-148.jpg",
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

const getPlaceByUser = (request, response, next) => {
    const userId = request.params.uid
    const place = DUMMYPLACES.find(p => {return p.creator === userId})

    if(!place){
        throw new HTTPError('Could not find place for this user!', 404)
    }


    response.json({place})
}

exports.getPlaceById = getPlaceById
exports.getPlaceByUser = getPlaceByUser