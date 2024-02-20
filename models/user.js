const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const options = { discriminatorKey: 'role' };

const userSchema = new mongoose.Schema(
    {
        sequential_id: {
            type: Number,
            unique: true 
        },
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

const employeeSchema = new mongoose.Schema({
    address: {
        type: String
    }
});

const customerSchema = new mongoose.Schema({
    address: {
        type: String
    }
});

const CounterSchema = new mongoose.Schema({
    collectionName: String,
    sequential_id: { type: Number, default: 1 }
});
const Counter = mongoose.model('Counter', CounterSchema);


userSchema.methods.isValidPassword = async function (password) {
    try {
        return bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};


userSchema.pre('save', async function (next) {
    const user = this;
    try { 
        if (user.isNew) {
            let counter = await Counter.findOneAndUpdate(
              { collectionName: 'users' },
              { $inc: { sequential_id: 1 } },
              { upsert: true, new: true }
            );
      
            user.sequential_id = counter.sequential_id;
        }

        // Hash password
        bcrypt.hash(this.password, 10, function (err, hash){
            if (err) {
                return next(err);
            }
            user.password = hash; 
            next();
        })
    } catch (error) {
        next(error); 
    }
});


// Create discriminator models
const User = mongoose.model('User', userSchema);

User.discriminator('admin', adminSchema);
User.discriminator('employee', employeeSchema);
User.discriminator('customer', customerSchema);

module.exports = User;
