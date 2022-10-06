const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/product-images/')
    },
    filename: function (req, file, cb) {
        const nameOfImage = Math.round(Math.random() * 1E9) + '-' + Date.now() + path.extname(file.originalname)
        cb(null, nameOfImage)
    }
})

const upload = multer({ storage: storage })
const multipleUpload = upload.fields([{ name: 'product-images', maxCount: 4 }])

module.exports = imgUpload = {
    multipleUpload: multipleUpload
} 

