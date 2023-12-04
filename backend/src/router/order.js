const express = require('express');
const OrderController = require('../app/controllers/OrderController');
const {MiddlewareLogin} = require('../app/middleware/MiddlewareLogin');
const router = express.Router();
// [GET] /orders
router.get('/', MiddlewareLogin.verifyToken, OrderController.getAllOrder)
router.get('/search', MiddlewareLogin.verifyToken, OrderController.searchOrder)
router.get('/:id', MiddlewareLogin.verifyToken, OrderController.getOrderById)
router.get('/users/:userId', MiddlewareLogin.verifyToken, OrderController.getOrderByUserId);
router.put('/', MiddlewareLogin.verifyTokenAndAdmin, OrderController.updateOrder);
router.get('/order-detail/:id', MiddlewareLogin.verifyToken, OrderController.getOrderDetailByOrderId)
router.delete('/', MiddlewareLogin.verifyTokenAndAdmin, OrderController.deleteOrder)
module.exports = router;