const userService = require('../services/userService');
const roles = require('../config/roles');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { User, Admin, Customer } = require('../models/user');


class AuthService {
    async signupUser(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;

            const newUser = await userService.createUser(userData);

            return newUser;
        } catch (error) {
            console.error('Error signing up user:', error);
            throw error;
        }
    }

    async signInUser(userCredentials) {
        try {
            const user = await userService.getUserByUsername(userCredentials.username);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Check if the password matches
            const isPasswordValid = await user.isValidPassword(userCredentials.password);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            const token = jwt.sign({ userId: user._id}, process.env.SECRET_KEY, {
                expiresIn: '1 hour'
            });

            return token;
        } catch (error) {
            console.error('Error signing in user:', error);
            throw error;
        }
    }

    async resetPassword(username, oldPassword, newPassword) {
        try {
            const user = await userService.getUserByUsername(username);
            if (!user) {
                throw new Error('User not found');
            }
            
            // Check if the old password is correct
            const isPasswordValid = await user.isValidPassword(oldPassword);
            if (!isPasswordValid) {
                throw new Error('Old password is incorrect');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.save();

            return user;
        } catch (error) {
            console.error('Error reseting password:', error);
            throw error;
        }
    }

    async assignRoleToUser(username, role) {
        try {
            // Ensure the provided role is valid
            const validRoles = roles.map(r => r.name);
            if (!validRoles.includes(role)) {
                throw new Error('Invalid role');
            }
            
            const user = await userService.getUserByUsername(username);
            if (!user) {
                throw new Error('User not found');
            }

            user.role = role;
            
            await user.save();
            
            // if (user.role !== role) {
            //     await user.remove();

            //     const userData = {
            //         username: user.username,
            //         email: user.email,
            //         password: user.password,
            //         role: newRole // Update the role
            //     };

            //     // Create a new document with the updated role
            //     const updatedUser =await userService.createUser(userData);

            //     updatedUser.role = role;

            //     return updatedUser;
            // }
        } catch (error) {
            console.error('Error assigning role to customer:', error);
            throw error;
        }
    }
}

const authService = new AuthService();

module.exports = authService;
