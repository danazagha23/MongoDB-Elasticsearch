const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require('dotenv').config();

const mongoose = require('./services/mongooseService');  
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

//prevent Dos attacks
app.use(express.urlencoded({ extended:  true }));
app.use(express.json({limit:"10kb"}));//body-limit is 10kb

// Helmet middleware for security headers
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


app.use('/api/auth', authRoutes);


app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
