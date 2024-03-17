const authService = require('../services/authService');

const signupUser = async (req, res) => {
  try {
    const userData = req.validatedData;;
    await authService.signupUser(userData);
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const signinUser = async (req, res) => {
  try {
    const userCredentials = req.body;
    const token = await authService.signInUser(userCredentials);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const username = req.body.username;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await authService.resetPassword(username, oldPassword, newPassword);
    res.json(user);
  } catch (error) {
    console.error('Error reseting new password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const assignRoleToUser = async (req, res) => {
  try {
    const username = req.body.username;
    const role = req.body.role;

    await authService.assignRoleToUser(username, role);

    res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Error assigning role to customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
    signupUser,
    signinUser,
    resetPassword,
    assignRoleToUser
};