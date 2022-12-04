//https://www.npmjs.com/package/multer
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //file.originalname => myphoto.png
        //path.extname => .png
        cb(null, uniquePrefix + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg", "image/webp"]

    if(allowedFileTypes.includes(file.mimetype)){
        //process the file, returns true
        cb(null, true)
    }else{
        //file won't be processed, returns false
        cb(null, false)
    }

}

const multerFileUpload = multer({ storage, fileFilter })
module.exports = multerFileUpload

