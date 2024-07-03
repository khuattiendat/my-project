const {
    MESSAGE_EMPTY,
    ERROR_SUCCESS,
    ERROR_FAILED,
    MESSAGE_SUCCESS,
    MESSAGE_ERROR,
    MESSAGE_EXIST,
} = require("../common/messageList");
const {isNullOrWhiteSpace, isNullOrEmptyArray} = require("../common/utils")
const Order = require("../models/Order")
const Product = require("../models/Product")
const User = require("../models/User")
const OrderDetail = require("../models/OrderDetail");
const {Op} = require("sequelize");
String.format = function () {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
// handle Order
const getAllOrder = async (page, value) => {
    try {
        if (!page) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EMPTY, "page")
            };
        }
        let orders = []
        let totalPage;
        let totalOrder;
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        Order.belongsTo(User, {
            foreignKey: "user_id"
        })
        if (!value) {
            const {rows, count} = await Order.findAndCountAll({
                include: [{
                    model: User,
                    required: false
                }],
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                orders.push(item.dataValues)
            })
            totalPage = Math.ceil(count / pageSize)
            totalOrder = count;
        } else {
            const {count, rows} = await Order.findAndCountAll({
                include: [{
                    model: User,
                    required: false
                }],
                where: {
                    [Op.or]: [
                        {order_id: {[Op.like]: '%' + value + '%'}},
                        {note: {[Op.like]: '%' + value + '%'}},
                        {total_money: {[Op.like]: '%' + value + '%'}},
                        {recipient_name: {[Op.like]: '%' + value + '%'}},
                        {recipient_phone: {[Op.like]: '%' + value + '%'}},
                        {'$user.name$': {[Op.like]: '%' + value + '%'}},
                        {'$user.email$': {[Op.like]: '%' + value + '%'}},
                        {'$user.phone_number$': {[Op.like]: '%' + value + '%'}},
                        {'$user.address$': {[Op.like]: '%' + value + '%'}},
                    ]
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                orders.push(item.dataValues);
            })
            totalPage = Math.ceil(count / pageSize)
            totalOrder = count;
        }

        return {
            error: ERROR_FAILED,
            data: {
                orders: orders,
                totalPage: totalPage,
                totalOrder: totalOrder
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getOrderByUserId = async (id, page, value, orderBy = "latest") => {
    try {
        if (!page) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EMPTY, "page")
            };
        }
        let orders = []
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        Order.belongsTo(User, {
            foreignKey: "user_id"
        })
        if (!value) {
            const {rows, count} = await Order.findAndCountAll({
                where: {
                    user_id: id
                },
                order: [
                    orderBy === "latest" ? ['createdAt', 'DESC'] : ['createdAt', 'ASC']
                ],
                include: [{
                    model: User,
                    required: false
                }],
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                orders.push(item.dataValues)
            })
            let totalPage = Math.ceil(count / pageSize)
            return {
                error: ERROR_FAILED,
                data: {
                    orders: orders,
                    totalPage: totalPage
                },
                message: MESSAGE_SUCCESS
            };
        } else {
            const {count, rows} = await Order.findAndCountAll({
                where: {
                    user_id: id,
                    [Op.or]: [
                        {order_id: {[Op.like]: '%' + value + '%'}},
                        {note: {[Op.like]: '%' + value + '%'}},
                        {total_money: {[Op.like]: '%' + value + '%'}},
                        {recipient_name: {[Op.like]: '%' + value + '%'}},
                        {recipient_phone: {[Op.like]: '%' + value + '%'}},
                        {'$user.name$': {[Op.like]: '%' + value + '%'}},
                        {'$user.email$': {[Op.like]: '%' + value + '%'}},
                        {'$user.phone_number$': {[Op.like]: '%' + value + '%'}},
                        {'$user.address$': {[Op.like]: '%' + value + '%'}},
                    ]
                },
                include: [{
                    model: User,
                    required: false
                }],
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                orders.push(item.dataValues);
            })
            let totalPage = Math.ceil(count / pageSize)
            return {
                error: ERROR_FAILED,
                data: {
                    orders: orders,
                    totalPage: totalPage
                },
                message: MESSAGE_SUCCESS
            };
        }

    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getOrderById = async (id) => {
    try {
        let orders = []
        Order.belongsTo(User, {
            foreignKey: "user_id"
        })
        const order = await Order.findOne({
            where: {
                id: id
            },
            include: [{
                model: User,
                required: false
            }]
        })
        if (order) {
            return {
                error: ERROR_FAILED,
                data: order,
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EXIST, "order")
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}
const randomNewOrderId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const addOrders = async (data) => {
    try {
        let messages = [];
        let orderId = randomNewOrderId(12);
        let checkOrderIdExist = await Order.findOne({
            where: {
                order_id: orderId
            }
        })
        if (checkOrderIdExist) {
            orderId = randomNewOrderId(12);
        }
        if (isNullOrWhiteSpace(data.user_id.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "id"))
        }
        if (isNullOrWhiteSpace(data.user_name.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "user name"))
        }
        if (isNullOrWhiteSpace(data.payment_method.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "payment method"))
        }
        if (isNullOrWhiteSpace(data.recipient_name.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "recipient name"))
        }
        if (isNullOrWhiteSpace(data.total_money.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "total money"))
        }
        if (isNullOrWhiteSpace(data.recipient_phone.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "phone number"))
        }
        if (isNullOrWhiteSpace(data.recipient_phone.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "phone number"))
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages
            };
        }

        const order = await Order.create({
            user_id: data.user_id,
            order_id: orderId,
            note: data.note,
            status_payment: 0,
            total_money: data.total_money,
            recipient_phone: data.recipient_phone,
            address_delivery: data.address_delivery,
            status_delivery: 0,
            recipient_name: data.recipient_name,
        })
        await order.save()
        if (order) {
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS
            }
        } else {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: MESSAGE_ERROR
            }
        }


    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error
        };
    }
}
const updateOrder = async (id, status_payment, status_delivery) => {
    try {
        const row = await Order.findOne({
            where: {
                id: id,
            }
        })
        if (row) {
            if (!status_payment) {
                await Order.update({
                    status_delivery: status_delivery
                }, {
                    where: {
                        id: id,
                    }
                })
            } else {
                await Order.update({
                    status_delivery: status_delivery,
                    status_payment: status_payment
                }, {
                    where: {
                        id: id,
                    }
                })
            }


            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: "order does not exist"
            }
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message,
        }
    }
}
const updateMoneyOrder = async (id, totalMoney) => {
    try {
        const row = await Order.findOne({
            where: {
                id: id,
            }
        })
        if (row) {
            await Order.update({
                total_money: totalMoney
            }, {
                where: {
                    id: id,
                }
            })
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: "order does not exist"
            }
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message,
        }
    }
}
const deleteOrder = async (id) => {
    try {
        const row = await Order.findAll({
            where: {id: id},
        })
        if (row.length > 0) {
            await OrderDetail.destroy({
                where: {order_id: id}
            })
            await Order.destroy({
                where: {id: id}
            })
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            }
        } else {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: String.format(MESSAGE_EXIST, "order"),
            }
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message,
        }
    }
}
// handle OrderDetail
const getOrderDetailByOrderId = async (id) => {
    try {
        OrderDetail.belongsTo(Product, {
            foreignKey: "product_id",
        })
        const orderDetail = await OrderDetail.findAll({
            include: [{
                model: Product,
                required: true
            }],
            where: {
                order_id: id,
            }
        })
        if (orderDetail) {
            return {
                error: ERROR_FAILED,
                data: orderDetail,
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: String.format(MESSAGE_EXIST, "order detail")
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}

const addOrderDetails = async (order_id, data) => {
    try {
        let messages = [];
        const arr = data.listProducts.map((item) => {
            if (!order_id) {
                messages.push(String.format(MESSAGE_EMPTY, "id order"))
            }
            if (isNullOrWhiteSpace(item.product_id.toString())) {
                messages.push(String.format(MESSAGE_EMPTY, "id product"))
            }
            if (isNullOrWhiteSpace(item.quantity.toString())) {
                messages.push(String.format(MESSAGE_EMPTY, "quantity"))
            }
            if (isNullOrWhiteSpace(item.price.toString())) {
                messages.push(String.format(MESSAGE_EMPTY, "price"))
            }
            if (isNullOrWhiteSpace(item.total_money.toString())) {
                messages.push(String.format(MESSAGE_EMPTY, "total money"))
            }
            if (!isNullOrEmptyArray(messages)) {
                return {
                    error: ERROR_SUCCESS,
                    data: null,
                    message: messages
                };
            }
            return {
                order_id: order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                total_money: item.total_money,
            }
        })
        const orderDetail = OrderDetail.bulkCreate(arr)
        if (orderDetail) {
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: MESSAGE_ERROR
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const deleteOrDerDetail = async (orderId, productId) => {
    try {
        const row = await OrderDetail.findAll({
            where: {
                [Op.or]: [
                    {order_id: orderId},
                    {product_id: productId}
                ]
            }
        })
        if (row.length > 0) {
            await OrderDetail.destroy({
                where: {
                    [Op.or]: [
                        {order_id: orderId},
                        {product_id: productId}
                    ]
                }
            })
            if (productId) {
                // lấy order có cái sp đấy
                row.map(async (item) => {
                    let orderId = item.dataValues.order_id;
                    let totalMoney = 0;
                    const orderDetail = await getOrderDetailByOrderId(orderId);
                    orderDetail.data.map((item) => {
                        totalMoney += item.dataValues.total_money;
                    })
                    await updateMoneyOrder(orderId, totalMoney)
                    if (totalMoney === 0) {
                        await deleteOrder(orderId, null)
                    }
                })
            }
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            }
        } else {
            return "OrderDetail does not exist"
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message,
        }
    }
}

module.exports = {
    addOrders,
    addOrderDetails,
    updateOrder,
    deleteOrDerDetail,
    deleteOrder,
    getAllOrder,
    getOrderDetailByOrderId,
    getOrderByUserId,
    updateMoneyOrder,
    getOrderById
}