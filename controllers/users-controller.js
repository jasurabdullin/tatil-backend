const {validationResult} = require('express-validator')

const HTTPError = require('../models/http-error')
const User = require('../models/user')


const getUsers = async (request, response, next) => {
    
    let users
    try {users = await User.find({}, '-password')} catch(err){
        const error = new HTTPError('Fetching users failed! Please try again.', 500)
        return next(error)
    }
    
    response.json({users: users.map(user => user.toObject({ getters:true }))})
}

const signup = async (request, response, next) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        console.log(errors)
        return next(new HTTPError('Invalid inputs', 422))
    }

    const {name, email, password} = request.body

    let existingUser
    try {  existingUser = await User.findOne({ email: email }) } catch(err){
        const error = new HTTPError('Sign up failed. Please try again!', 500)
        return next(error)
    }

    if(existingUser){
        const error = new HTTPError('This email already exists. Please log in or sign up with a different email!', 422)
        return next(error)
    }

    const createdUser = new User ({
        name,
        email,
        image: 'https://avatars3.githubusercontent.com/u/51510943?s=460&u=83778a8abf884c8a5c336cd69f10085713944f19&v=4',
        password,
        places: []
    })

    try { await createdUser.save() } catch(err) {
        const error = new HTTPError('Failed to create a new user!', 500)
        return next(error)
    }

    response.status(201).json({user: createdUser.toObject({ getters: true })})
}

const login = async (request, response, next) => {
    const {email, password} = request.body

    let existingUser
    try {  existingUser = await User.findOne({ email: email }) } catch(err){
        const error = new HTTPError('Login failed. Please try again!', 500)
        return next(error)
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HTTPError('Invalid credentials! Please try logging in again.', 401)
        return next(error)
    }

    response.json({message: 'Logged in!'})

}





exports.getUsers = getUsers
exports.signup = signup
exports.login = login