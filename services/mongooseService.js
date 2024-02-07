const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

const elasticsearchService = require('./elasticsearchService');

// Connect to MongoDB
mongoose.connect('mongodb://mongodb-elasticsearch-mongo-1:27017?replicaSet=rs0')
    .then(() => {
        console.log("Connected to MongoDB successfully");
        
        const userChangeStream = User.watch();
        const productChangeStream = Product.watch();
        const orderChangeStream = Order.watch();

        // Listen for change events on the User collection
        userChangeStream.on('change', (change) => {
            console.log('User change:', change);
            handleModelChange('users', change);
        });

        // Listen for change events on the Product collection
        productChangeStream.on('change', (change) => {
            console.log('Product change:', change);
            handleModelChange('products', change);
        });

        // Listen for change events on the Order collection
        orderChangeStream.on('change', (change) => {
            console.log('Order change:', change);
            handleModelChange('orders', change);
        });

        // Error handling for change streams
        userChangeStream.on('error', (error) => {
            console.error('User change stream error:', error);
        });

        productChangeStream.on('error', (error) => {
            console.error('Product change stream error:', error);
        });

        orderChangeStream.on('error', (error) => {
            console.error('Order change stream error:', error);
        });

        // Close MongoDB connection on process exit
        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log('MongoDB connection closed');
                process.exit(0);
            });
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

async function handleModelChange(modelName, change) {
    const { operationType, fullDocument, documentKey } = change;

    const documentId = documentKey._id.toString();

    switch (operationType) {
        case 'insert':
            console.log(`Document inserted in ${modelName}:`, fullDocument);

            // Remove internal fields
            delete fullDocument._id;
            delete fullDocument.__v;

            await elasticsearchService.index_Document(modelName, documentId, fullDocument);
            break;
        case 'update':
            console.log(`Document updated in ${modelName}:`, fullDocument);
            
            await elasticsearchService.update_Document(modelName, documentKey._id, fullDocument);
            break;
        case 'delete':
            console.log(`Document deleted in ${modelName}:`, documentKey);
            await elasticsearchService.delete_Document(modelName, documentId);
            break;
        default:
            console.log(`Unknown operation type for ${modelName}`);
    }
}