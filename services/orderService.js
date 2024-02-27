const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');
const productService = require('../services/productService');


class OrderService {
  async createOrder(orderData) {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newOrder = new Order(orderData);

      // Check product availability and add each product to the order
      for (const productId of orderData.products) {
        const product = await Product.findById(productId).session(session);
        if (!product || !product.available) {
            throw new Error(`Product with ID ${productId} is not available.`);
        }

        product.quantity -= 1;
        if(product.quantity < 1){
          product.available = false;
        }
        await product.save();
        
        newOrder.totalPrice += product.price;
      }

      // Save the order
      const savedOrder = await newOrder.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return savedOrder;
    } catch (error) {
        // Rollback the transaction if any error occurs
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating order:', error);
        throw error;
    }
  }

  async getAllOrders() {
    try {
      return await Order.find();
    } catch (error) {
      console.error('Error getting all orders:', error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      return await Order.findById(orderId);
    } catch (error) {
      console.error('Error getting order by ID:', error);
      throw error;
    }
  }

  async getUserOrders(userId) {
    try {
        const orders = await Order.find({ userId });
        return orders;
    } catch (error) {
        throw new Error('Error fetching user orders');
    }
  }

  async updateOrder(orderId, updatedOrderData) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedOrderData, { new: true });
      
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      return deletedOrder
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

const orderService = new OrderService();

module.exports = orderService;
