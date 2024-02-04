const Order = require('../models/order');
const elasticsearchService = require('./elasticsearchService');

class OrderService {
  async createOrder(orderData) {
    try {
      const newOrder = new Order(orderData);
      const savedOrder = await newOrder.save();

      // Remove internal fields
      const orderWithoutInternalFields = savedOrder.toObject();
      delete orderWithoutInternalFields._id;
      delete orderWithoutInternalFields.__v;

      const documentId = savedOrder._id.toString();
      await elasticsearchService.index_Document('orders', documentId, orderWithoutInternalFields);
      
      return savedOrder;
    } catch (error) {
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

  async updateOrder(orderId, updatedOrderData) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedOrderData, { new: true });
      
      return await elasticsearchService.update_Document('orders', orderId, updatedOrderData);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(orderId) {
    try {
      const deletedOrder = await Order.findByIdAndDelete(orderId);

      return await elasticsearchService.delete_Document('orders', orderId);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
}

const orderService = new OrderService();

module.exports = orderService;
