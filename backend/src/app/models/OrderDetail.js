const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../../config/connectDB')
const Order = require("./Order.js")
const OrderDetail = sequelize.define('order_details', {
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total_money: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
    paranoid: true,
});
// OrderDetail.associate = (models) => {
//     OrderDetail.belongsTo(models.Order, {
//         foreignKey: "order_id",
//     });
// }
module.exports = OrderDetail;