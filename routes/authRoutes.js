const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkDuplicateEmail, checkDuplicateUsername, checkPassword } = require('../middlewares/verifySignup');

router.post('/signup', 
    checkDuplicateEmail,
    checkDuplicateUsername,
    checkPassword,
    authController.signupUser
);

router.post('/signin', 
    authController.signinUser
);

router.post('/resetPassword', 
    authController.resetPassword
);

module.exports = router;
