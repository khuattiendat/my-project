const {updateQuantityProduct} = require("../services/productService");
const {ERROR_SUCCESS} = require("../common/messageList");
const Product = require("../models/Product");

const MiddlewarePayment = {
    checkQuantity: async (req, res, next) => {
        const {listProducts} = req.body;
        for (const each of listProducts) {
            const product = await Product.findOne({
                where: {
                    id: each.product_id
                }
            });

            if (product.quantity < each.quantity) {
                return res.status(406).send({
                    error: ERROR_SUCCESS,
                    message: "Số lượng sản phẩm không đủ",
                    data: {
                        product_id: product.id,
                        quantity: product.quantity,
                        name: product.name
                    }
                });
            }
        }

        return next();
    }
}
module.exports = {
    MiddlewarePayment
}