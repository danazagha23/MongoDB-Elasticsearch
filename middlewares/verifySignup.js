const userService = require('../services/userService');

const checkDuplicateEmail = async (req, res, next) => {
    const { email } = req.body;
    try {
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        next(); 
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const checkDuplicateUsername = async (req, res, next) => {
    const { username } = req.body;
    try {
        const existingUser = await userService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        next(); 
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const checkPassword = (req, res, next) => {
    const { password } = req.body;
    const isValidPassword = password && password.length >= 6; 
    if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    next(); 
};

module.exports = {
    checkDuplicateEmail,
    checkDuplicateUsername,
    checkPassword
};