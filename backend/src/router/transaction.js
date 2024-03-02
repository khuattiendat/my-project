const express = require('express');
const TransactionController = require('../app/controllers/TransactionController');
const {MiddlewareLogin} = require('../app/middleware/MiddlewareLogin');
const router = express.Router();
// [GET] /transactions
router.get("/users", MiddlewareLogin.verifyTokenAndAdmin, TransactionController.getTransactionByUserId)

router.get("/latest", MiddlewareLogin.verifyTokenAndAdmin, TransactionController.getLatestTransaction)
router.get("/revenue-daily", MiddlewareLogin.verifyTokenAndAdmin, TransactionController.getRevenueDaily)
router.get("/revenue-monthly", MiddlewareLogin.verifyTokenAndAdmin, TransactionController.getRevenueMonthly)
router.get("/:id", MiddlewareLogin.verifyTokenAndAdmin, TransactionController.getTransactionById);
router.get("/", MiddlewareLogin.verifyTokenAndAdmin, TransactionController.getAllTransaction)
module.exports = router;