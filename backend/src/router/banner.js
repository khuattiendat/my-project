const express = require('express');
const router = express.Router();
const BannerController = require('../app/controllers/BannerController');
const {MiddleWareUploadFiles} = require("../app/middleware/MiddlewareUploadFiles");
const {MiddlewareLogin} = require("../app/middleware/MiddlewareLogin");
router.get('/', BannerController.getAllBanner);
router.get('/isActive', BannerController.getAllBannerIsActive);
router.get('/:id', BannerController.getBannerById);
router.put('/isActive/:id', MiddlewareLogin.verifyTokenAndAdmin, BannerController.updateIsActive);
router.post('/', MiddlewareLogin.verifyTokenAndAdmin, MiddleWareUploadFiles, BannerController.addBanner);
router.put('/:id', MiddlewareLogin.verifyTokenAndAdmin, MiddleWareUploadFiles, BannerController.updateBanner);
router.delete('/', MiddlewareLogin.verifyTokenAndAdmin, BannerController.deleteBanner);


module.exports = router;