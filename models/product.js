const mongoose = require('../services/mongooseService');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;