const sequelize = require("../../config/connectDB");
const {QueryTypes} = require("sequelize");
const {ERROR_FAILED, MESSAGE_SUCCESS, ERROR_SUCCESS} = require("../common/messageList");
const Product = require("../models/Product");
const Category = require("../models/Category");
// thống kê sản phẩm theo danh mục
const statisticalCategoryProduct = async () => {
    try {
        const sql = 'SELECT categories.id AS id, categories.name AS categoryName, COUNT(products.id) AS totalProduct, MAX(products.price) AS maxPrice, MIN(products.price) AS minPrice, AVG(products.price) AS averagePrice FROM products  INNER JOIN categories ON products.category_id = categories.id WHERE (products.deletedAt IS NULL AND categories.deletedAt IS NULL) GROUP BY categories.name;'
        const response = await sequelize.query(sql, {type: QueryTypes.SELECT})
        return {
            error: ERROR_FAILED,
            data: response,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}

// Thống kê tồn kho
const statisticalInventory = async () => {
    try {
        Product.belongsTo(Category, {foreignKey: 'category_id'})
        const response = await Product.findAll({
            include: [{
                model: Category,
                required: false
            }
            ],
            order: [
                ['quantity', 'DESC']
            ]
        })
        return {
            error: ERROR_FAILED,
            data: response,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
// thống kê doanh thu theo năm
const statisticalRevenueYear = async (year) => {
    try {
        const sql = `SELECT id, (MONTH(createdAt)) AS month ,SUM(transactions.amount) AS total FROM transactions WHERE NOT transactions.status_payment = 2 AND (YEAR(createdAt)) = ${year} GROUP BY MONTH ORDER BY MONTH;`;
        const response = await sequelize.query(sql, {type: QueryTypes.SELECT})
        return {
            error: ERROR_FAILED,
            data: response,
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
// thống kê doanh thu theo trong ngày
const statisticalRevenueDaily = async () => {
    try {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const _date = year + "-" + month + "-" + day;
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
// thống kê doanh thu theo tháng
const statisticalRevenueMonthly = async () => {
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
    statisticalCategoryProduct,
    statisticalInventory,
    statisticalRevenueYear,
    statisticalRevenueDaily,
    statisticalRevenueMonthly
}