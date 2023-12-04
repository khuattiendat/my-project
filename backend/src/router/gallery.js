const GalleryController = require('../app/controllers/GalleryController')
const express = require('express')
const router = express.Router();
// [GET] /users/id
router.get("/:idProduct", GalleryController.getGalleryByProductId)
module.exports = router;