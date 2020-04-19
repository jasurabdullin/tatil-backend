const jwt = require('jsonwebtoken')

const HTTPError = require('../models/http-error')

module.exports = (request, response, next) => {
    if(request.method === 'OPTIONS'){
        return next()
    }
    try {
        const token = request.headers.authorization.split(' ')[1] //Authorization: 'Bearer TOKEN'
        if(!token){
            const error = new HTTPError('Authentication failed!', 403)
            return next(error)
        }
        const decodedToken = jwt.verify(token, 'bingbingaslan')
        request.userData = { userId: decodedToken.userId }
        next()
    } catch (err){
        const error = new HTTPError('Authentication failed!', 403)
        return next(error)
    }
}