const Transaction = require("../models/Transaction")
const {
    ERROR_FAILED,
    MESSAGE_SUCCESS,
    ERROR_SUCCESS,
    MESSAGE_EMPTY,
    MESSAGE_ERROR,
    MESSAGE_EXIST,
    MESSAGE_ALL_EMPTY
} = require('../common/messageList');
const {customDateTime, isNullOrWhiteSpace, isNullOrEmptyArray} = require('../common/utils');
const {Op} = require("sequelize");
const sequelize = require('../../config/connectDB');
const {QueryTypes} = require('sequelize');
String.format = function () {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
const getAllTransaction = async (page, value) => {
    try {
        if (!page) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EMPTY, "page")
            };
        }
        let transactions = []
        let totalPage;
        let totalTransaction;
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        if (!value) {
            const {rows, count} = await Transaction.findAndCountAll({
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                transactions.push(item.dataValues)
            })
            totalPage = Math.ceil(count / pageSize)
            totalTransaction = count;
        } else {
            const {count, rows} = await Transaction.findAndCountAll({
                where: {
                    [Op.or]: [
                        {user_name: {[Op.like]: '%' + value + '%'}},
                        {user_phone: {[Op.like]: '%' + value + '%'}},
                        {user_email: {[Op.like]: '%' + value + '%'}},
                        {amount: {[Op.like]: '%' + value + '%'}},
                    ]
                },
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                transactions.push(item.dataValues);
            })
            totalPage = Math.ceil(count / pageSize)
            totalTransaction = count
        }
        return {
            error: ERROR_FAILED,
            data: {
                transactions: transactions,
                totalPage: totalPage,
                totalTransaction: totalTransaction
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
const getTransactionByUserId = async (userId, page) => {
    if (!page || !userId) {
        return {
            error: ERROR_SUCCESS,
            message: String.format(MESSAGE_EMPTY, "page and userId")
        };
    }
    try {
        let transactions = []
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        const {rows, count} = await Transaction.findAndCountAll({
            where: {
                user_id: userId
            },
            limit: pageSize,
            offset: offset
        })
        await rows.forEach((item) => {
            transactions.push(item.dataValues)
        })
        let totalPage = Math.ceil(count / pageSize)
        return {
            error: ERROR_FAILED,
            data: {
                transactions: transactions,
                totalPage: totalPage,
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
const addTransaction = async (data) => {
    try {
        let messages = [];
        if (isNullOrWhiteSpace(data.user_id)) {
            messages.push(String.format(MESSAGE_EMPTY, "id"))
        }
        if (isNullOrWhiteSpace(data.user_name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"))
        }
        if (isNullOrWhiteSpace(data.user_phone)) {
            messages.push(String.format(MESSAGE_EMPTY, "phone"))
        }
        if (isNullOrWhiteSpace(data.user_email)) {
            messages.push(String.format(MESSAGE_EMPTY, "email"))
        }
        if (isNullOrWhiteSpace(data.total_money.toString())) {
            messages.push(String.format(MESSAGE_EMPTY, "total money"))
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages
            };
        }
        const transaction = await Transaction.create({
            user_id: data.user_id,
            user_name: data.user_name,
            user_email: data.user_email,
            status_payment: 0,
            payment_method: data.payment_method,
            user_phone: data.user_phone,
            amount: data.total_money,
        })
        await transaction.save()
        if (transaction) {
            return {
                error: ERROR_FAILED,
                data: null,
                messages: MESSAGE_SUCCESS
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
            message: error.message
        };
    }
}
const updateTransaction = async (id, data, status_payment) => {
    try {
        const row = await Transaction.findOne({
            where: {
                id: id,
            }
        })
        if (row) {
            await Transaction.update({
                status_payment: status_payment,
                security: data != null ? data.id : null
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
                message: "user does not exist"
            }
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message,
        }
    }
}
const searchTransactions = async (value, page) => {
    let result;
    if (!value || !page) {
        result = {
            error: ERROR_SUCCESS,
            message: String.format(MESSAGE_ALL_EMPTY, "value", "page")
        };
        return result
    }
    let transactions = [];
    let pageSize = parseInt(process.env.PAGE_SIZE);
    let offset = (page - 1) * pageSize;
    if (page < 1) {
        page = 1;
    }
    const {count, rows} = await Transaction.findAndCountAll({
        where: {
            [Op.or]: [
                {user_name: {[Op.like]: '%' + value + '%'}},
                {user_phone: {[Op.like]: '%' + value + '%'}},
                {user_email: {[Op.like]: '%' + value + '%'}},
                {amount: {[Op.like]: '%' + value + '%'}},
            ]
        },
        limit: pageSize,
        offset: offset
    })
    await rows.forEach((item) => {
        transactions.push(item.dataValues);
    })
    let totalPage = Math.ceil(count / pageSize)
    if (rows) {
        result = {
            error: ERROR_FAILED,
            data: {
                product: transactions,
                totalPage: totalPage
            },
            message: MESSAGE_SUCCESS
        };
        return result;
    } else {
        result = {
            error: ERROR_SUCCESS,
            message: String.format(MESSAGE_EXIST, "transaction")
        };
        return result;
    }
}
const getLatestTransaction = async () => {
    try {
        const transaction = await Transaction.findAll({
            order: [
                ['id', "DESC"]
            ],
            limit: 10,
        })
        return {
            error: ERROR_FAILED,
            data: transaction,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getTransactionById = async (id) => {
    if (!id) {
        return {
            error: ERROR_SUCCESS,
            message: String.format(MESSAGE_EMPTY, "id")
        };
    }
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: id,
            }
        })
        if (!transaction) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: String.format(MESSAGE_EXIST, "transaction")
            };
        }
        return {
            error: ERROR_FAILED,
            data: transaction,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}
const getRevenueDaily = async () => {
    try {
        const date = new Date();
        const _date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const sql = "SELECT SUM(transactions.amount) AS total FROM transactions WHERE NOT transactions.status_payment = 2 and transactions.createdAt LIKE '" + _date + "%'";
        const transaction = await sequelize.query(sql, {type: QueryTypes.SELECT});
        return {
            error: ERROR_FAILED,
            data: transaction,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }

}
const getRevenueMonthly = async () => {
    try {
        const sql = "SELECT(MONTH(createdAt)) AS month, (YEAR(createdAt)) AS year ,SUM(transactions.amount) AS total FROM transactions WHERE NOT transactions.status_payment = 2  GROUP BY MONTH ORDER BY MONTH DESC LIMIT 12";
        const transaction = await sequelize.query(sql, {type: QueryTypes.SELECT});
        return {
            error: ERROR_FAILED,
            data: transaction,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
module.exports = {
    getAllTransaction,
    addTransaction,
    updateTransaction,
    searchTransactions,
    getLatestTransaction,
    getTransactionByUserId,
    getTransactionById,
    getRevenueDaily,
    getRevenueMonthly
}