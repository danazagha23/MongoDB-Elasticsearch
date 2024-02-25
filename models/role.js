const mongoose = require('mongoose');

const UserRoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const ApiRoleSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },
    endpoint: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
});

const UserRole = mongoose.model("UserRole", UserRoleSchema);

const ApiRole = mongoose.model("ApiRole", ApiRoleSchema);


module.exports = { UserRole, ApiRole };