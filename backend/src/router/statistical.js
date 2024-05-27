const express = require('express');
const router = express.Router();
const {MiddlewareLogin} = require('../app/middleware/MiddlewareLogin')
const StatisticalController = require('../app/controllers/StatisticalController');
router.get('/category-product', MiddlewareLogin.verifyTokenAndAdmin, StatisticalController.categoryProduct);
router.get('/inventory', MiddlewareLogin.verifyTokenAndAdmin, StatisticalController.statisticalInventory);
router.get('/revenue-daily', MiddlewareLogin.verifyTokenAndAdmin, StatisticalController.revenueDaily);
router.get('/revenue-monthly', MiddlewareLogin.verifyTokenAndAdmin, StatisticalController.revenueMonthly);
router.get('/revenue-yearly', MiddlewareLogin.verifyTokenAndAdmin, StatisticalController.revenueYear);
module.exports = router;