const express = require('express')
const { check } = require('express-validator')

const router = express.Router()

const usersController = require('../controllers/users-controller')
const fileUpload = require('../middleware/file-upload')


router.get('/', usersController.getUsers)

router.post(
    '/signup',
    fileUpload.single('image'), //should match with formData appendage in Login component from frontend
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 7})
    ],
    usersController.signup
)


router.post('/login', usersController.login)


module.exports = router