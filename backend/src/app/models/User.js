const {DataTypes} = require("sequelize");
const sequelize = require('../../config/connectDB');

const User = sequelize.define('users', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        allowNull: false,
        type: DataTypes.STRING
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    },
    role_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    gender: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },

}, {
    timestamps: true,
    paranoid: true,
});
// User.associate = (models => {
//     User.hasMany(models.Order, {onDelete: "cascade", hooks: true});
// });
module.exports = User;