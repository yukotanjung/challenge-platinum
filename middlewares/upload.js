require('dotenv').config()
const multer = require('multer')
const path = require('path')
const cloudinary = require('cloudinary').v2
const fs = require('fs')


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/images')   
    },
    filename: (req, file, callback) => {
        callback(
            null,
            Date.now() + path.extname(file.originalname)
          );
    },
})


const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback('Please upload a valid image file')
        }
        callback(undefined, true)
    }
})


cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRET
})

async function uploadCloudinary(filePath) {
    let resp;
    try {
        resp = await cloudinary.uploader.upload(filePath, {
            use_filename: true
        })

        fs.unlinkSync(filePath)
        return resp.url
    } catch (e) {
        fs.unlinkSync(filePath)
        return e
    }
}

module.exports = {
    uploadImage,
    uploadCloudinary,
}