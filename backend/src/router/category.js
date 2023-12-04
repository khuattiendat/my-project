const express = require('express');
const router = express.Router();
const CategoryController = require('../app/controllers/CategoryController');

router.get('/', CategoryController.getAllCategory);
router.get('/paging', CategoryController.getCategoryByPaging);
router.get('/search', CategoryController.searchCategory);
router.get('/name', CategoryController.getIdCategoryByName)
router.get('/:id', CategoryController.getCategoryById);
router.post('/', CategoryController.addCategory)
router.put('/:id', CategoryController.updateCategory)
router.delete('/', CategoryController.deleteCategory)
module.exports = router;