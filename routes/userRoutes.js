const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authJwt');
const checkRole = require('../middlewares/checkRole');

router.get('/', authenticate, checkRole, userController.getAllUsers);
router.get('/:id', authenticate, checkRole, userController.getUserById);

router.post('/', authenticate, checkRole, userController.createUser);
router.put('/:id', authenticate, checkRole, userController.updateUser);
router.delete('/:id', authenticate, checkRole, userController.deleteUser);

module.exports = router;
