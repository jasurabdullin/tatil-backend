const {v4: uuidv4 } = require('uuid')
const {validationResult} = require('express-validator')

const HTTPError = require('../models/http-error')

const DUMMYUSERS = [
    {
        id: 'u1',
        name: 'Jasur Abdullin',
        email: 'test@test.com',
        password: 'testing'
    }
]


const getUsers = (request, response, next) => {
    response.json({users: DUMMYUSERS})
}

const signup = (request, response, next) => {

    const errors = validationResult(request)
    if(!errors.isEmpty()){
        console.log(errors)
        throw new HTTPError('Invalid inputs', 422)
    }

    const {name, email, password} = request.body

    const existingUser = DUMMYUSERS.find(u => u.email === email)

    if(existingUser){throw new HTTPError('Email already exists', 422)}

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMYUSERS.push(createdUser)

    response.status(201).json({user: createdUser})
}

const login = (request, response, next) => {
    const {email, password} = request.body

    const activeUser = DUMMYUSERS.find(u => u.email === email)

    if(!activeUser || activeUser.password !== password){
        throw new HTTPError('Could not identify user!', 401)
    }

    response.json({message: 'Logged in'})

}





exports.getUsers = getUsers
exports.signup = signup
exports.login = login