const { Router } = require('express')
const { check } = require('express-validator')

const router = Router()

const placesController = require('../controllers/places-controller')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

router.get('/:pid', placesController.getPlaceById)

router.get('/user/:uid', placesController.getPlacesByUser)

router.use(checkAuth)

router.post(
    '/', 
    fileUpload.single('image'),
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5}),
        check('address').not().isEmpty()
    ], 
    placesController.createPlace
)

router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({min: 5})
    ], 
    placesController.updatePlace 
)

router.delete('/:pid', placesController.deletePlace )

module.exports = router