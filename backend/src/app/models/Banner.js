const sequelize = require('../../config/connectDB');
const {Model, DataTypes} = require('sequelize');
const Banner = sequelize.define('banners', {
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: true,
    paranoid: true,
})
module.exports = Banner;
