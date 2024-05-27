const {ERROR_SUCCESS} = require("../common/messageList");
const {
    statisticalCategoryProduct,
    statisticalInventory,
    statisticalRevenueYear,
    statisticalRevenueDaily,
    statisticalRevenueMonthly,
} = require("../services/statisticalService");
const StatisticalController = {
    categoryProduct: async (req, res) => {
        try {
            const products = await statisticalCategoryProduct();
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    statisticalInventory: async (req, res) => {
        try {
            const products = await statisticalInventory();
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    revenueDaily: async (req, res) => {
        try {
            const response = await statisticalRevenueDaily();
            if (response.error !== ERROR_SUCCESS) {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    revenueMonthly: async (req, res) => {
        try {
            const response = await statisticalRevenueMonthly();
            if (response.error !== ERROR_SUCCESS) {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    revenueYear: async (req, res) => {
        try {
            const year = req.query.year;
            console.log(year)
            const response = await statisticalRevenueYear(year);
            if (response.error !== ERROR_SUCCESS) {
                res.status(200).send(response);
            } else {
                res.status(400).send(response);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}
module.exports = StatisticalController;