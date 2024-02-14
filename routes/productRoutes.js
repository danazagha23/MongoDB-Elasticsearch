const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middlewares/authJwt');
const checkRole = require('../middlewares/checkRole');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', authenticate, checkRole('admin'), productController.createProduct);
router.put('/:id', authenticate, checkRole('admin'), productController.updateProduct);
router.delete('/:id', authenticate, checkRole('admin'), productController.deleteProduct);

module.exports = router;
