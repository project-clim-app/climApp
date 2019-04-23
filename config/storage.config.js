const cloudinary = require('cloudinary'); //-------------------------- REVISAR SI ESTA INSTALADO y CONFIGURADO cloudinary-----------------------
const cloudinaryStorage = require('multer-storage-cloudinary'); //-------------------------- REVISAR SI ESTA INSTALADO y CONFIGURADO cloudinary-multer-----------------------
const multer = require('multer'); //-------------------------- REVISAR SI ESTA INSTALADO y CONFIGURADO mulder-----------------------

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  //-------------------------no configurado ------------------------------------
  api_key: process.env.CLOUDINARY_API_KEY, //-------------------------no configurado ------------------------------------
  api_secret: process.env.CLOUDINARY_API_SECRET //-------------------------no configurado ------------------------------------
})

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'profile-avatars',
  allowFormats: ['jpg', 'png'],
  filename: (req, file, next) => {
    next(null, `${Date.now()}${file.originalname}`)
  }
})

module.exports = multer({ storage });