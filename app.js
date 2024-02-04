const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./services/mongooseService');  
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const elasticsearchRoutes = require('./routes/elasticsearchRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/elasticsearch', elasticsearchRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
