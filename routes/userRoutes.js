const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authJwt');
const checkRole = require('../middlewares/checkRole');

router.get('/', authenticate, checkRole('admin'), userController.getAllUsers);
router.get('/:id', authenticate, checkRole('admin'), userController.getUserById);

router.post('/', authenticate, checkRole('admin'), userController.createUser);
router.put('/:id', authenticate, checkRole('admin'), userController.updateUser);
router.delete('/:id', authenticate, checkRole('admin'), userController.deleteUser);

module.exports = router;
