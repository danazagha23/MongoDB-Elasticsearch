const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean")

require('dotenv').config();

const mongoose = require('./services/mongooseService');  
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Helmet middleware for security headers
app.use(helmet());

app.use(xss());

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

//Temporary endpoint for XSS testing purposes only
app.post('/api/xss-test', (req, res) => {
  const sanitizedInput = req.body.input;

  // Respond with sanitized input
  res.status(200).json({ sanitizedInput });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;