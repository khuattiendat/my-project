const {Op, Sequelize} = require('sequelize');
const sequelize = require('../../config/connectDB');
const {
    ERROR_FAILED,
    MESSAGE_SUCCESS,
    ERROR_SUCCESS,
    MESSAGE_EMPTY,
    MESSAGE_EXIST,
    MESSAGE_ALL_EMPTY
} = require('../common/messageList');
const {isNullOrWhiteSpace, isNullOrEmptyArray} = require('../common/utils');

const Category = require('../models/Category');
const Product = require('../models/Product');
const {deleteProduct} = require('./productService');
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
const getAllCategory = async () => {
    try {
        Category.hasMany(Product, {foreignKey: "category_id"})
        const category = await Category.findAll({
            attributes: {
                include: [[Sequelize.fn("COUNT", Sequelize.col("category_id")), "productCount"]]
            },
            include: [{
                model: Product, attributes: []
            }],
            group: ['id']
        });
        var result = {
            error: ERROR_FAILED,
            data: category,
            message: MESSAGE_SUCCESS
        }
        return result
    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
        return result
    }
}
const getAllCategoryByPaging = async (page, value = "") => {
    try {
        if (!page) {
            let result = {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EMPTY, "page")
            }
            return result;
        }
        let totalPage;
        let categories = []
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        if (!value) {
            const {rows, count} = await Category.findAndCountAll({
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                categories.push(item.dataValues)
            })
            totalPage = Math.ceil(count / pageSize)
        } else {
            const {rows, count} = await Category.findAndCountAll({
                where: {
                    name: {[Op.like]: '%' + value + '%'}
                },
                limit: pageSize,
                offset: offset
            })
            await rows.forEach((item) => {
                categories.push(item.dataValues)
            })
            totalPage = Math.ceil(count / pageSize)
        }
        let result = {
            error: ERROR_FAILED,
            data: {
                categories: categories,
                totalPage: totalPage
            },
            message: MESSAGE_SUCCESS
        }
        return result;
    } catch (error) {
        let result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
        return result
    }
}
const addCategory = async (data) => {
    try {
        var messages = [];
        const checkNameCategory = await Category.findOne({
            where: {
                name: data.name
            }
        })
        if (isNullOrWhiteSpace(data.name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"));
        }
        if (checkNameCategory) {
            messages.push("name Category is exist");
        }
        if (!isNullOrEmptyArray(messages)) {
            var result = {
                error: ERROR_SUCCESS,
                data: null,
                message: messages,
            };
            return result
        }
        const category = await Category.create({
            name: data.name
        })
        await category.save()
        if (category) {
            var result = {
                error: ERROR_FAILED,
                data: category.dataValues,
                message: MESSAGE_SUCCESS,
            };
            return result
        }

    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            data: null,
            message: error.message,
        };
        return result;
    }
}
const updateCategory = async (id, data) => {
    try {
        var messages = [];
        if (isNullOrWhiteSpace(data.name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"));
        }
        if (!isNullOrEmptyArray(messages)) {
            var result = {
                error: ERROR_SUCCESS,
                message: messages,
            };
            return result
        }
        const row = await Category.findOne({
            where: {
                id: id,
            }
        })
        if (row) {
            await Category.update({
                name: data.name
            }, {
                where: {
                    id: id,
                }
            })
            var result = {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            };
            return result;
        } else {
            var result = {
                error: ERROR_FAILED,
                data: null,
                message: "user does not exist",
            };
            return result;
        }
    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message,
        };
        return result
    }
}
const deleteCategory = async (id) => {
    try {
        const productId = (await Product.findAll({where: {category_id: id}})).map((id) => id.dataValues.id)
        const row = await Category.findAll({
            where: {
                id: id
            }
        })
        if (row.length > 0) {
            deleteProduct([...productId])
            await Category.destroy({
                where: {
                    id: id
                }
            })
            var result = {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            };
            return result
        } else {
            var result = {
                error: ERROR_FAILED,
                data: null,
                message: "user does not exist",
            };
            return result;
        }
    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message,
        };
        return result
    }
}
const searchCategory = async (value, page) => {
    try {
        if (!value || !page) {
            var result = {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_ALL_EMPTY, "value", "page")
            }
            return result
        }
        let categories = []
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        const {rows, count} = await Category.findAndCountAll({
            where: {
                name: value
            },
            limit: pageSize,
            offset: offset
        })
        await rows.forEach((item) => {
            categories.push(item.dataValues)
        })
        let totalPage = Math.ceil(count / pageSize)
        var result = {
            error: ERROR_FAILED,
            data: {
                product: categories,
                totalPage: totalPage
            },
            message: MESSAGE_SUCCESS
        }
        return result;
    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
        return result
    }
}
const getCategoryById = async (id) => {
    try {
        const category = await Category.findOne({
            where: {
                id: id
            }
        })
        if (category) {
            var result = {
                error: ERROR_FAILED,
                data: category,
                message: MESSAGE_SUCCESS
            }
            return result
        } else {
            var result = {
                error: ERROR_FAILED,
                data: null,
                message: String.format(MESSAGE_EXIST, "category")
            }
            return result
        }
    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
        return result
    }
}
const getIdCategoryByName = async (name) => {
    try {
        const category = await Category.findAll({
            where: {
                name: {[Op.like]: '%' + name + '%'}
            },
            attributes: ['id']
        })
        if (category) {
            var result = {
                error: ERROR_FAILED,
                data: category,
                message: MESSAGE_SUCCESS
            }
            return result
        } else {
            var result = {
                error: ERROR_FAILED,
                data: null,
                message: String.format(MESSAGE_EXIST, "category")
            }
            return result
        }
    } catch (error) {
        var result = {
            error: ERROR_SUCCESS,
            message: error.message
        }
        return result
    }
}
module.exports = {
    getAllCategory,
    getAllCategoryByPaging,
    addCategory,
    updateCategory,
    deleteCategory,
    searchCategory,
    getCategoryById,
    getIdCategoryByName
}