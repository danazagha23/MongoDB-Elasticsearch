const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticate = require('../middlewares/authJwt');
const checkRole = require('../middlewares/checkRole');

router.post('/', authenticate, orderController.createOrder);

router.get('/', authenticate, orderController.getUserOrders);

router.get('/all', authenticate, checkRole, orderController.getAllOrders);
router.get('/:id', authenticate, checkRole, orderController.getOrderById);
router.put('/:id', authenticate, checkRole, orderController.updateOrder);
router.delete('/:id', authenticate, checkRole, orderController.deleteOrder);


module.exports = router;
