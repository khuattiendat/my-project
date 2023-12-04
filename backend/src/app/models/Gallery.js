const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../../config/connectDB')
const Gallery = sequelize.define('galleries', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    timestamps: true,
    paranoid: true,
})
module.exports = Gallery;