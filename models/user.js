const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const options = { discriminatorKey: 'role' };

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        }
    },
    options
);

// Creating discriminators for different types of users
const adminSchema = new mongoose.Schema({});

const customerSchema = new mongoose.Schema({
    address: {
        type: String
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        return bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    bcrypt.hash(this.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        this.password = hash;
        next();
    })
});

// Create discriminator models
const User = mongoose.model('User', userSchema);
const Admin = User.discriminator('admin', adminSchema);
const Customer = User.discriminator('customer', customerSchema);

module.exports = { User, Admin, Customer };
