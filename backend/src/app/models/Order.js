const {DataTypes} = require("sequelize");
const sequelize = require('../../config/connectDB');
const OrderDetail = require("./OrderDetail");
const User = require("./User");
const Order = sequelize.define('orders', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    note: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status_delivery: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    status_payment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address_delivery: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipient_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    recipient_phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_money: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: true,
    paranoid: true,
    hooks: {
        afterDestroy: async (order, options) => {
            try {
                await OrderDetail.destroy({where: {order_id: order.id}})
            } catch (error) {
                console.error(error);
            }
        }
    }
});

// status_delivery : 0: chưa giao, 1: đang giao, 2: đã giao
// status_payment : 0: chưa thanh toán, 1: đã thanh toán
module.exports = Order;