const multer = require('multer')
import {v1 as uuidv1 } from 'uuid'
import { request } from 'express'

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg',
}

//creating a file uploading middleware
const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (request, file, callback) => {
            callback(null,'uploads/images')
        },
        filename: (request, file, callback) => {
            const ext = MIME_TYPE_MAP[file.mimetype]
            callback(null, uuidv1() + '.' + ext)
        }
    }),
    fileFilter: (request, file, callback) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Invalid mime type!')
        callback(error, isValid)
    }
})

module.exports = fileUpload