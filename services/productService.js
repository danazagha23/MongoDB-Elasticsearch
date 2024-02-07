const Product = require('../models/product');
const elasticsearchService = require('./elasticsearchService');

class ProductService {
  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      
      return savedProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      throw error;
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });

      return updatedProduct;

    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);

      return deletedProduct;

    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}

const productService = new ProductService();

module.exports = productService;
