const express = require('express');
const PaymentController = require('../app/controllers/PaymentController');
const {MiddlewarePayment} = require('../app/middleware/MiddlewarePayment')
const {MiddlewareLogin} = require('../app/middleware/MiddlewareLogin');
const router = express.Router();

router.post('/payByPaypal', MiddlewareLogin.verifyToken, MiddlewarePayment.checkQuantity, PaymentController.paymentProductByPaypal)
router.post('/payByCash', MiddlewareLogin.verifyToken, MiddlewarePayment.checkQuantity, PaymentController.paymentProductByCash)
router.get('/payByPaypal/success', PaymentController.ResponsePaymentSuccess)
router.get('/payByPaypal/cancel', PaymentController.ResponsePaymentCancel)
module.exports = router;