const express = require('express');
const router = express.Router();
const {MiddlewareLogin} = require('../app/middleware/MiddlewareLogin')
const ProductController = require('../app/controllers/ProductController');
const {MiddleWareUploadFiles} = require('../app/middleware/MiddlewareUploadFiles');
router.get('/', ProductController.getAllProducts);
router.get('/paging', ProductController.getProductByPagingOrSearch)
router.get('/search', ProductController.searchProduct)
router.get('/best-sellers', ProductController.getBestSellers)
router.get('/best-discount', ProductController.getBestDiscount)
router.get('/newest', ProductController.getNewest)
router.get('/filter', ProductController.filterProduct)
router.get('/gallery/:idProduct', ProductController.getListImages);
router.get('/:id', ProductController.getProductById);
router.get('/categories/:id', ProductController.getProductByCategory);
router.post('/', MiddlewareLogin.verifyTokenAndAdmin, MiddleWareUploadFiles, ProductController.addProduct);
router.put('/:id', MiddlewareLogin.verifyTokenAndAdmin, MiddleWareUploadFiles, ProductController.updateProduct);
router.delete('/', MiddlewareLogin.verifyTokenAndAdmin, ProductController.deleteProduct);
module.exports = router;