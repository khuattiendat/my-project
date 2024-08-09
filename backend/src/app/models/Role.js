const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../../config/connectDB')
const Role = sequelize.define('roles', {
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
})
module.exports = Role;