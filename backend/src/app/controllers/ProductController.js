const {
    ERROR_SUCCESS,
} = require('../common/messageList');
const {
    getAllProducts,
    getProductById,
    getProductByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByPagingOrSearch,
    getListImages, getBestSellers, getNewest, filterProduct
} = require('../services/productService');
const ProductController = {
    getBestSellers: async (req, res) => {
        try {
            const products = await getBestSellers();
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    // [GET] /api/products
    getNewest: async (req, res) => {
        try {
            const products = await getNewest();
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getAllProducts: async (req, res) => {
        try {
            const products = await getAllProducts();
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    // [GET] /api/products/id
    getProductById: async (req, res) => {
        try {
            const id = req.params.id;
            const product = await getProductById(id);
            if (product.error !== ERROR_SUCCESS) {
                res.status(200).send(product);
            } else {
                res.status(400).send(product);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    // [GET] /products/categories/id
    getProductByCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const product = await getProductByCategory(id);
            if (product.error !== ERROR_SUCCESS) {
                res.status(200).send(product);
            } else {
                res.status(400).send(product);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    // [POST] /api/products
    addProduct: async (req, res) => {
        try {
            // const data = req.body;
            console.log(req);
            const files = req.files;
            const product = await addProduct(req, files);
            if (product.error !== ERROR_SUCCESS) {
                res.status(200).send(product);
            } else {
                res.status(400).send(product);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    // [PUT] /api/products
    updateProduct: async (req, res) => {
        try {
            console.log(req);
            const id = req.params.id;
            const data = req.body;
            const files = req.files;
            const products = await updateProduct(id, data, files);
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    // [DELETE] /api/products
    deleteProduct: async (req, res) => {
        try {
            const id = req.body.id;
            const product = await deleteProduct(id)
            if (product.error !== ERROR_SUCCESS) {
                res.status(200).send(product);
            } else {
                res.status(400).send(product);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    //[GET] /products/paging
    getProductByPagingOrSearch: async (req, res) => {
        try {
            const page = parseInt(req.query.page);
            const value = req.query.q;
            const products = await getProductByPagingOrSearch(page, value)
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products);
            } else {
                res.status(400).send(products);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getListImages: async (req, res) => {
        try {
            const id = req.params.idProduct;
            const listImages = await getListImages(id);
            if (listImages.error !== ERROR_SUCCESS) {
                res.status(200).send(listImages);
            } else {
                res.status(400).send(listImages);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    filterProduct: async (req, res) => {
        try {
            const price = req.query.price;
            const orderBy = req.query.orderBy;
            const page = req.query.page;
            const categories = req.query.categories ?? [];
            const products = await filterProduct(price, orderBy, categories, page)
            if (products.error !== ERROR_SUCCESS) {
                res.status(200).send(products)
            } else {
                res.status(400).send(products)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
}
module.exports = ProductController;