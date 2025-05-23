const paypal = require('paypal-rest-sdk');
const {ERROR_SUCCESS, ERROR_FAILED, MESSAGE_SUCCESS,} = require('../common/messageList');
const {addTransaction, updateTransaction} = require('../services/transactionService');
const {addOrders, addOrderDetails, updateOrder, deleteOrDerDetail, deleteOrder} = require('../services/orderService');
const sequelize = require('../../config/connectDB');
const {QueryTypes} = require('sequelize');
const {updateQuantityProduct} = require("../services/productService");
require('dotenv').config();
const HOST = process.env.HOST
const FRONTEND_URL = process.env.FRONTEND_URL
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});
let listProducts = [];
const PaymentController = {
    paymentProductByPaypal: async (req, res) => {
        try {
            const data = req.body;
            console.log(data)
            listProducts = data.listProducts;
            const transaction = await addTransaction(data);
            if (transaction.error === ERROR_SUCCESS) {
                return res.status(400).send(transaction)
            }
            const transactionId = await sequelize.query("SELECT MAX(id) AS id FROM transactions", {type: QueryTypes.SELECT});
            const order = await addOrders(data);
            if (order.error === ERROR_SUCCESS) {
                return res.status(400).send(order)
            }
            const orderId = await sequelize.query("SELECT MAX(id) AS id FROM orders", {type: QueryTypes.SELECT});
            const orderDetail = await addOrderDetails(orderId[0].id, data);
            // check addOrderDetails
            if (orderDetail.error === ERROR_SUCCESS) {
                return res.status(400).send(orderDetail)
            }
            //
            const items = [];
            let totalMoney = 0;
            data.listProducts.map((item) => {
                let price = (Number(item.price) / Number(req.body.rate)).toFixed(2);
                let totalPrice = (price * item.quantity).toFixed(2);
                let result = {
                    name: item.name,
                    price: price,
                    quantity: item.quantity,
                    "currency": "USD",
                }
                totalMoney += Number(totalPrice);
                items.push(result);

            })
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${HOST}api/payments/payByPaypal/success?totalMoney=${totalMoney}&transactionId=${transactionId[0].id}&orderId=${orderId[0].id}`,
                    "cancel_url": `${HOST}api/payments/payByPaypal/cancel?&transactionId=${transactionId[0].id}&orderId=${orderId[0].id}`
                },
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": totalMoney,
                        "details": {
                            "shipping": "0",
                            "tax": "0",
                            "subtotal": totalMoney,
                        }
                    },
                    "item_list": {
                        "items": items
                    },
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log(error)
                    res.status(400).send(error);
                } else {
                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.json({forwardLink: payment.links[i].href});
                        }
                    }
                }
            });
        } catch (error) {
            res.status(500).send(error)
        }
    },
    ResponsePaymentSuccess: async (req, res) => {
        const totalMoney = req.query.totalMoney;
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": totalMoney,
                }
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
            if (error) {
                // throw error;

                res.status(400).send(error);
            } else {
                const transactionId = req.query.transactionId;
                const orderId = req.query.orderId;
                await updateTransaction(transactionId, payment, 1);
                await updateOrder(orderId, 1, null)
                await updateQuantityProduct(listProducts);
                res.status(200).redirect(`${FRONTEND_URL}/users/order`);
            }
        });
    },
    ResponsePaymentCancel: async (req, res) => {
        const orderId = req.query.orderId;
        const transactionId = req.query.transactionId;
        await deleteOrDerDetail(orderId);
        await deleteOrder(orderId);
        await updateTransaction(transactionId, null, 2)

        res.status(200).redirect(FRONTEND_URL)
    },
    paymentProductByCash: async (req, res) => {
        try {
            const data = req.body;
            listProducts = data.listProducts;
            const transaction = await addTransaction(data);
            if (transaction.error === ERROR_SUCCESS) {
                return res.status(406).send(transaction)
            }
            const order = await addOrders(data);
            if (order.error === ERROR_SUCCESS) {
                return res.status(406).send(order)
            }
            const orderId = await sequelize.query("SELECT MAX(id) AS id FROM orders", {type: QueryTypes.SELECT});
            const orderDetail = await addOrderDetails(orderId[0].id, data);
            // check addOrderDetails
            if (orderDetail.error === ERROR_SUCCESS) {
                return res.status(406).send(orderDetail)
            }
            await updateQuantityProduct(listProducts);
            res.send({
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = PaymentController;