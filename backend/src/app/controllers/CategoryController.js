const {ERROR_SUCCESS} = require("../common/messageList");
const {
    getAllCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    searchCategory,
    getCategoryById,
    getAllCategoryByPaging, getIdCategoryByName
} = require("../services/categoryService");

const CategoryController = {
    getAllCategory: async (req, res) => {
        try {
            const category = await getAllCategory();
            return res.status(200).send(category);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getCategoryByPaging: async (req, res) => {
        try {
            const page = req.query.page;
            const value = req.query.q;
            const category = await getAllCategoryByPaging(page, value);
            return res.status(200).send(category);
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await getCategoryById(id);
            if (category.error != ERROR_SUCCESS) {
                res.status(200).send(category);
            } else {
                res.status(400).send(category)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    getIdCategoryByName: async (req, res) => {
        try {
            const name = req.query.name;
            const category = await getIdCategoryByName(name);
            if (category.error != ERROR_SUCCESS) {
                res.status(200).send(category);
            } else {
                res.status(400).send(category)
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    addCategory: async (req, res) => {
        try {
            const data = req.body;
            const category = await addCategory(data);
            if (category.error != ERROR_SUCCESS) {
                res.status(200).send(category);
            } else {
                res.status(400).send(category);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }

    },
    updateCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;
            const category = await updateCategory(id, data);
            if (category.error != ERROR_SUCCESS) {
                res.status(200).send(category);
            } else {
                res.status(400).send(category);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const id = req.body.id;
            const category = await deleteCategory(id);
            if (category.error != ERROR_SUCCESS) {
                res.status(200).send(category);
            } else {
                res.status(400).send(category);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
    searchCategory: async (req, res) => {
        try {
            const value = req.query.q;
            const page = req.query.page;
            const category = await searchCategory(value, page);
            if (category.error != ERROR_SUCCESS) {
                res.status(200).send(category);
            } else {
                res.status(400).send(category);
            }
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}
module.exports = CategoryController