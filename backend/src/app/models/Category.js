const {Sequelize, Model, DataTypes} = require("sequelize");
const sequelize = require('../../config/connectDB')
const Category = sequelize.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    paranoid: true,
})
module.exports = Category;