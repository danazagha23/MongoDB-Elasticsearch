const User = require('../models/user');


class UserService {
  async createUser(userData) {
    try {
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
      }

    }
  

  async getAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async updateUser(userId, updatedUserData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);

      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

const userService = new UserService();

module.exports = userService;
