const mongoose = require('mongoose');
const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Role = require('../models/role');
const rolesData = require('../config/roles.json');


const elasticsearchService = require('./elasticsearchService');

const mongodbUrl = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongodbUrl)
    .then(async () => {
        console.log("Connected to MongoDB successfully");
        
        await importRoles();

        setupChangeStreams();

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

async function importRoles() {
    try {
        // Insert roles from roles.json
        await Role.insertMany(rolesData);
        console.log('Roles imported successfully');
    } catch (error) {
        console.error('Error importing roles:', error);
    }
}

function setupChangeStreams() {
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
}

async function handleModelChange(modelName, change) {
    const operationType = change.operationType;

    const documentId = change.documentKey._id.toString();

    switch (operationType) {
        case 'insert':
            const fullDocument = change.fullDocument;
            console.log(`Document inserted in ${modelName}:`, fullDocument);

            // Remove internal fields
            delete fullDocument._id;
            delete fullDocument.__v;

            await elasticsearchService.index_Document(modelName, documentId, fullDocument);
            break;
        case 'update':
            const updatedFields = change.updateDescription.updatedFields;
            console.log(`Document updated in ${modelName}:`, updatedFields);

            await elasticsearchService.update_Document(modelName, documentId, updatedFields);
            break;
        case 'delete':
            console.log(`Document deleted in ${modelName}:`, documentId);
            await elasticsearchService.delete_Document(modelName, documentId);
            break;
        default:
            console.log(`Unknown operation type for ${modelName}`);
    }
}