const {ERROR_SUCCESS} = require("../common/messageList");
const {
    getAllOrder,
    deleteOrder,
    getOrderDetailByOrderId,
    searchOrder,
    getOrderByUserId,
    getOrderById, updateOrder
} = require("../services/orderService")

const OrderController = {
    getAllOrder: async (req, res) => {
        try {
            const page = req.query.page;
            const value = req.query.q;
            const order = await getAllOrder(page, value)
            if (order.error !== ERROR_SUCCESS) {
                res.status(200).send(order)
            } else {
                res.status(400).send(order)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    deleteOrder: async (req, res) => {
        try {
            const id = req.body.id;
            const order = await deleteOrder(id)
            if (order.error != ERROR_SUCCESS) {
                res.status(200).send(order)
            } else {
                res.status(400).send(order)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    getOrderDetailByOrderId: async (req, res) => {
        try {
            const id = req.params.id;
            const orderDetails = await getOrderDetailByOrderId(id);
            if (orderDetails.error != ERROR_SUCCESS) {
                res.status(200).send(orderDetails)
            } else {
                res.status(400).send(orderDetails)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    searchOrder: async (req, res) => {
        try {
            const value = req.query.q;
            const page = req.query.page;
            const order = await searchOrder(value, page);
            if (order.error != ERROR_SUCCESS) {
                res.status(200).send(order)
            } else {
                res.status(400).send(order)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    getOrderByUserId: async (req, res) => {
        try {
            const id = req.params.userId;
            const page = req.query.page;
            const value = req.query.q;
            const orders = await getOrderByUserId(id, page, value);
            if (orders.error !== ERROR_SUCCESS) {
                res.status(200).send(orders)
            } else {
                res.status(400).send(orders)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    getOrderById: async (req, res) => {
        try {
            const id = req.params.id;
            const order = await getOrderById(id);
            if (order.error !== ERROR_SUCCESS) {
                res.status(200).send(order)
            } else {
                res.status(400).send(order)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    updateOrder: async (req, res) => {
        try {
            const id = req.body.id;
            const status_payment = req.body.status_payment;
            const status_delivery = req.body.status_delivery;
            const order = await updateOrder(id, status_payment, status_delivery)
            if (order.error !== ERROR_SUCCESS) {
                res.status(200).send(order)
            } else {
                res.status(400).send(order)
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
}
module.exports = OrderController