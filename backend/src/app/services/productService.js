const {QueryTypes, Op} = require("sequelize");
const sequelize = require("../../config/connectDB");
const {
    ERROR_FAILED,
    MESSAGE_SUCCESS,
    ERROR_SUCCESS,
    MESSAGE_EXIST,
    MESSAGE_EMPTY,
    MESSAGE_ALL_EMPTY
} = require("../common/messageList");
const {isNullOrWhiteSpace, isNullOrEmptyArray} = require("../common/utils");
const Product = require("../models/Product");
const Category = require('../models/Category')
const {addGallery, updateGallery, deleteGallery} = require("./galleryService");
const {getOrderDetailByOrderId, updateMoneyOrder,} = require("./orderService");
const OrderDetail = require("../models/OrderDetail");
const Order = require("../models/Order");
const Gallery = require("../models/Gallery");
require('dotenv').config();
String.format = function () {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        const reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
const getBestSellers = async () => {
    try {
        const sql = `SELECT SUM(order_details.quantity) as total_sold, products.* FROM order_details INNER JOIN products ON order_details.product_id = products.id WHERE order_details.deletedAt IS NULL AND products.deletedAt IS NULL GROUP BY products.id ORDER BY SUM(order_details.quantity) DESC LIMIT 10`;
        const products = await sequelize.query(sql, {type: QueryTypes.SELECT})
        return {
            error: ERROR_FAILED,
            data: {
                products: products,
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getNewest = async () => {
    try {
        const products = await Product.findAll({
            order: [
                ["createdAt", "DESC"]
            ],
            limit: 10
        })
        return {
            error: ERROR_FAILED,
            data: {
                products: products,
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getAllProducts = async () => {
    try {
        let products = [];
        Product.belongsTo(Category, {foreignKey: 'category_id'})
        // Gallery.belongsTo(Product, {foreignKey: "product_id"})
        const {count, rows} = await Product.findAndCountAll({
            include: [{
                model: Category,
                required: false
            }
            ]
        });
        await rows.forEach((item) => {
            products.push(item.dataValues)
        })
        return {
            error: ERROR_FAILED,
            data: {
                products: products,
                totalProducts: count
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getProductById = async (id) => {
    try {
        Product.belongsTo(Category, {foreignKey: 'category_id'})
        const product = await Product.findOne({
            include: [{
                model: Category,
                required: false
            }
            ],
            where: {
                id: id
            }
        })
        if (product) {
            return {
                error: ERROR_FAILED,
                data: product,
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EXIST, "product")
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getProductByCategory = async (id) => {
    try {
        Product.belongsTo(Category, {foreignKey: 'category_id'})
        const product = await Product.findAll({
            include: [{
                model: Category,
                required: false
            }
            ],
            where: {
                category_id: id
            }
        })
        if (product.length > 0) {
            return {
                error: ERROR_FAILED,
                data: product,
                message: MESSAGE_SUCCESS
            }
        } else {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EXIST, "product")
            }
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const addProduct = async (req, files) => {
    try {
        const messages = [];
        const filenameList = [];
        if (isNullOrWhiteSpace(req.body.name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"))
        }
        if (isNullOrWhiteSpace(req.body.price)) {
            messages.push(String.format(MESSAGE_EMPTY, "price"))
        }
        if (isNullOrWhiteSpace(req.body.discount)) {
            messages.push(String.format(MESSAGE_EMPTY, "discount"));
        }
        if (isNullOrWhiteSpace(req.body.description)) {
            messages.push(String.format(MESSAGE_EMPTY, "description"));
        }
        if (isNullOrWhiteSpace(req.body.quantity)) {
            messages.push(String.format(MESSAGE_EMPTY, "quantity"))
        }
        if (req.fileValidationError) {
            messages.push(req.fileValidationError);
        } else if (req.files.length === 0) {
            messages.push('Please select an image to upload')
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages
            };
        }
        files.map((file) => {
            filenameList.push(file.filename)
        })
        const products = await Product.create({
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            description: req.body.description,
            quantity: req.body.quantity,
            category_id: req.body.category_id,
            image: files[0].filename,
        })
        await products.save()
        const getMaxId = await sequelize.query("SELECT MAX(id) Max_id FROM products", {type: QueryTypes.SELECT})
        const product_id = await (getMaxId[0].Max_id);
        await addGallery(filenameList, product_id)
        return {
            error: ERROR_FAILED,
            data: products,
            message: MESSAGE_SUCCESS
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const updateProduct = async (id, data, files) => {
    let result;
    try {
        const messages = [];
        const filenameList = [];
        if (isNullOrWhiteSpace(data.name)) {
            messages.push(String.format(MESSAGE_EMPTY, "name"))
        }
        if (isNullOrWhiteSpace(data.price)) {
            messages.push(String.format(MESSAGE_EMPTY, "price"))
        }
        if (isNullOrWhiteSpace(data.discount)) {
            messages.push(String.format(MESSAGE_EMPTY, "discount"));
        }
        if (isNullOrWhiteSpace(data.description)) {
            messages.push(String.format(MESSAGE_EMPTY, "description"));
        }
        if (isNullOrWhiteSpace(data.quantity)) {
            messages.push(String.format(MESSAGE_EMPTY, "quantity"))
        }
        const checkNameProduct = await Product.findAll({
            where: {
                name: data.name,
                id: {
                    [Op.not]: id
                }
            }
        })
        if (checkNameProduct.length > 0) {
            messages.push("Tên sản phẩm đã tồn tại !!!");
        }
        if (!isNullOrEmptyArray(messages)) {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: messages
            }
        }
        if (files.length > 0) {
            const row = await Product.findOne({
                where: {
                    id: id
                }
            })
            if (row) {
                await Product.update({
                    name: data.name,
                    price: data.price,
                    discount: data.discount,
                    description: data.description,
                    quantity: data.quantity,
                    category_id: data.category_id,
                    image: files[0].filename,
                }, {
                    where: {
                        id: id,
                    }
                })
                files.map((file) => {
                    filenameList.push(file.filename)
                })
                await updateGallery(filenameList, id)
                result = {
                    error: ERROR_FAILED,
                    data: null,
                    message: MESSAGE_SUCCESS
                };
                return result
            } else {
                result = {
                    error: ERROR_SUCCESS,
                    data: null,
                    message: "product does not exist"
                };
                return result
            }
        } else {
            const row = await Product.findOne({
                where: {
                    id: id
                }
            })
            if (row) {
                await Product.update({
                    name: data.name,
                    price: data.price,
                    discount: data.discount,
                    description: data.description,
                    quantity: data.quantity,
                    category_id: data.category_id,
                }, {
                    where: {
                        id: id,
                    }
                })
                result = {
                    error: ERROR_FAILED,
                    data: null,
                    message: MESSAGE_SUCCESS
                };
                return result
            } else {
                result = {
                    error: ERROR_SUCCESS,
                    data: null,
                    message: "product does not exist"
                };
                return result
            }
        }

    } catch (error) {
        result = {
            error: ERROR_SUCCESS,
            message: error.message
        };
        return result
    }
}
const deleteProduct = async (id) => {
    try {
        const orderIds = await OrderDetail.findAll({where: {product_id: id}})
        const row = await Product.findAll({
            where: {
                id: id,
            }
        })
        if (row.length > 0) {
            await OrderDetail.destroy({
                where: {product_id: id}
            })
            // lấy order có cái sp đấy
            orderIds.map(async (item) => {
                let orderId = item.dataValues.order_id;
                let totalMoney = 0;
                const orderDetail = await getOrderDetailByOrderId(orderId);
                orderDetail.data.map((item) => {
                    totalMoney += item.dataValues.total_money;
                })
                await updateMoneyOrder(orderId, totalMoney)
                if (totalMoney === 0) {
                    Order.destroy({where: {id: orderId}})
                }
            })
            await deleteGallery(id)
            await Product.destroy({
                where: {
                    id: id,
                }
            })
            return {
                error: ERROR_FAILED,
                data: null,
                message: MESSAGE_SUCCESS,
            }
        } else {
            return "product does not exist";
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }
}
const searchProduct = async (value, page) => {
    try {
        if (!value || !page) {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_ALL_EMPTY, "value", "page")
            }
        }
        let products = [];
        let pageSize = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * pageSize;
        if (page < 1) {
            page = 1;
        }
        Product.belongsTo(Category, {
            foreignKey: 'category_id',
        })
        const {count, rows} = await Product.findAndCountAll({
            include: [{
                model: Category,
                required: false,
            }
            ],
            where: {
                [Op.or]: [
                    {name: {[Op.like]: '%' + value + '%'}},
                    {description: {[Op.like]: '%' + value + '%'}},
                    {price: {[Op.like]: '%' + value + '%'}},
                    {'$Category.name$': {[Op.like]: '%' + value + '%'}}
                ]
            },
            limit: pageSize,
            offset: offset
        })
        await rows.forEach((item) => {
            products.push(item.dataValues);
        })
        let totalPage = Math.ceil(count / pageSize)
        if (rows) {
            return {
                error: ERROR_FAILED,
                data: {
                    product: products,
                    totalPage: totalPage
                },
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                message: String.format(MESSAGE_EXIST, "Product")
            };
        }
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getProductByPagingOrSearch = async (page = 1, value) => {
    try {
        let products = []
        let totalPage;
        let perPage = parseInt(process.env.PAGE_SIZE);
        let offset = (page - 1) * perPage;
        if (page < 1) {
            page = 1;
        }
        Product.belongsTo(Category, {foreignKey: 'category_id'})
        if (!value) {
            const {rows, count} = await Product.findAndCountAll({
                include: [{
                    model: Category,
                    required: false
                }
                ],
                limit: perPage,
                offset: offset
            })
            await rows.forEach((item) => {
                products.push(item.dataValues)
            })
            totalPage = Math.ceil(count / perPage)
        } else {
            const {count, rows} = await Product.findAndCountAll({
                include: [{
                    model: Category,
                    required: false,
                }
                ],
                where: {
                    [Op.or]: [
                        {name: {[Op.like]: '%' + value + '%'}},
                        {description: {[Op.like]: '%' + value + '%'}},
                        {price: {[Op.like]: '%' + value + '%'}},
                        {'$Category.name$': {[Op.like]: '%' + value + '%'}}
                    ]
                },
                limit: perPage,
                offset: offset
            })
            await rows.forEach((item) => {
                products.push(item.dataValues);
            })
            totalPage = Math.ceil(count / perPage)
        }
        return {
            error: ERROR_FAILED,
            data: {
                products: products,
                totalPage: totalPage
            },
            message: MESSAGE_SUCCESS
        };
    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        };
    }
}
const getListImages = async (id) => {
    try {
        const gallery = await Gallery.findAll({
            where: {
                product_id: id
            }
        });
        if (gallery.length > 0) {
            return {
                error: ERROR_FAILED,
                data: gallery,
                message: MESSAGE_SUCCESS
            };
        } else {
            return {
                error: ERROR_SUCCESS,
                data: null,
                message: String.format(MESSAGE_EXIST, "product")
            }
        }

    } catch (error) {
        return {
            error: ERROR_SUCCESS,
            message: error.message
        }
    }
}
const filterProduct = async (price, orderBy, categories, page = 1) => {
    let result;
    try {
        // QUERY BUILDER CHAY BANG COM
        // CHO NAY TRAN VIET HOANG VIET
        let hasCategories = categories.length ? `AND products.category_id IN (${categories.join(",")})` : "";
        const hasPrice = price === "1" ? `AND products.price BETWEEN 0 AND 3000000`
            : price === "2" ? `AND products.price BETWEEN 3000000 AND 5000000`
                : price === "3" ? `AND products.price BETWEEN 5000000 AND 7000000`
                    : price === "4" ? `AND products.price BETWEEN 7000000 AND 10000000`
                        : price === "5" ? `AND products.price >= 10000000` : "";

        const perPage = 9;
        const offset = (page - 1) * perPage;

        let countProductSql = `SELECT COUNT(*) as total FROM products WHERE products.deletedAt IS NULL ${hasPrice} ${hasCategories}`;
        let sql = `SELECT products.* FROM products WHERE products.deletedAt IS NULL ${hasPrice} ${hasCategories}`;

        switch (orderBy) {
            case "priceLowToHigh":
                sql = `${sql} ORDER BY products.price ASC LIMIT ${perPage} OFFSET ${offset}`
                break;
            case "priceHighToLow":
                sql = `${sql} ORDER BY products.price DESC LIMIT ${perPage} OFFSET ${offset}`
                break;
            case "nameAtoZ":
                sql = `${sql} ORDER BY products.name ASC LIMIT ${perPage} OFFSET ${offset}`
                break;
            case "nameZtoA":
                sql = `${sql} ORDER BY products.name DESC LIMIT ${perPage} OFFSET ${offset}`
                break;
            default:
                break;
        }

        const count = await sequelize.query(countProductSql, {type: QueryTypes.SELECT})
        const data = await sequelize.query(sql, {type: QueryTypes.SELECT})

        result = {
            error: ERROR_FAILED,
            data: {
                products: data,
                pagination: {
                    total: count?.[0].total,
                    perPage: perPage,
                    currentPage: page,
                    totalPage: Math.ceil(count?.[0].total / perPage),
                }
            },
            message: MESSAGE_SUCCESS
        };
        return result;
    } catch (error) {
        result = {
            error: ERROR_SUCCESS,
            message: error.message
        };
        return result;
    }
}
const updateQuantityProduct = async (products) => {
    for (const each of products) {
        const product = await Product.findOne({
            where: {
                id: each.product_id
            }
        });

        if (!!product) {
            await Product.update({
                quantity: product.quantity - each.quantity
            }, {
                where: {
                    id: each.product_id
                }
            })
        }
    }
}
module.exports = {
    getBestSellers,
    getNewest,
    getAllProducts,
    getProductById,
    getProductByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProduct,
    getProductByPagingOrSearch,
    getListImages,
    filterProduct,
    updateQuantityProduct
}