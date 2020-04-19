const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch(err){
        const error = new HTTPError('Could not create user! Please try again.', 500)
        return next(error)
    }

    const createdUser = new User ({
        name,
        email,
        image: request.file.path,
        password: hashedPassword,
        places: []
    })

    try { await createdUser.save() } catch(err) {
        const error = new HTTPError('Failed to create a new user!', 500)
        return next(error)
    }

    let token
    try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email}, 
            'bingbingaslan', 
            {expiresIn: '1h'}
        )
    } catch(err){
        const error = new HTTPError('Failed to create a new user!', 500)
        return next(error)
    }

    response.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token })
}

const login = async (request, response, next) => {
    const {email, password} = request.body

    let existingUser
    try {  existingUser = await User.findOne({ email: email }) } catch(err){
        const error = new HTTPError('Login failed. Please try again!', 500)
        return next(error)
    }

    if(!existingUser){
        const error = new HTTPError('Invalid credentials! Please try logging in again.', 403)
        return next(error)
    }

    let isValidPassword = false
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch(err){
        const error = new HTTPError('Invalid credentials! Please try again.')
        return next(error)
    }

    if(!isValidPassword){
        const error = new HTTPError('Invalid credentials! Please try again.')
        return next(error)
    }

    let token
    try {
        token = jwt.sign(
            {userId: existingUser.id, email:existingUser.email}, 
            'bingbingaslan', 
            {expiresIn: '1h'}
        )
    } catch(err){
        const error = new HTTPError('Login failed! Please try again.', 500)
        return next(error)
    }

    response.json({ userId: existingUser.id, email: existingUser.email, token: token})

}


exports.getUsers = getUsers
exports.signup = signup
exports.login = login