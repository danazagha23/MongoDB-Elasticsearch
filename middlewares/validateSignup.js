const { body, validationResult, matchedData } = require('express-validator');

const validateSignupData = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Middleware to extract validated and sanitized data
const extractValidatedData = (req, res, next) => {
    req.validatedData = matchedData(req);
    next();
};

module.exports = { validateSignupData, handleValidationErrors, extractValidatedData };