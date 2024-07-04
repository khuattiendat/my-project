const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + "/src/public/uploads/");
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let uploadMultipleFiles = multer({storage: storage, fileFilter: imageFilter}).array('multiple_images', 10);
const MiddleWareUploadFiles = (req, res, next) => {
    uploadMultipleFiles(req, res, (err) => {
        if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
            // handle multer file limit error here
            res.send('LIMIT_UNEXPECTED_FILE')
        } else if (err) {
            res.send(err.message)
        } else {
            // make sure to call next() if all was well
            next();
        }
    })
}
module.exports = {
    MiddleWareUploadFiles
}