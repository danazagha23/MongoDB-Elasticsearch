const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignupData, handleValidationErrors } = require('../middlewares/validateSignup');
const authenticate = require('../middlewares/authJwt');
const checkRole = require('../middlewares/checkRole');

router.post('/signup',
    validateSignupData,
    handleValidationErrors,
    authController.signupUser
);

router.post('/signin', 
    authController.signinUser
);

router.post('/resetPassword', 
    authController.resetPassword
);

router.post('/assignRole', 
    authenticate, 
    checkRole,
    authController.assignRoleToUser
);

module.exports = router;
