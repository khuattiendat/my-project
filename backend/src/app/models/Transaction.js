const {Sequelize, Model, DataTypes} = require("sequelize");
const sequelize = require('../../config/connectDB')
const Transaction = sequelize.define('transactions', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    amount: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    },
    payment_info: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    status_payment: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    payment_method: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    security: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
}, {
    timestamps: true,
    paranoid: true,
})
// status_payment : 0: chưa thanh toán, 1: đã thanh toán, 2: đã hủy
// payment_method : 0: thanh toán khi nhận hàng, 1: thanh toán qua thẻ
module.exports = Transaction;