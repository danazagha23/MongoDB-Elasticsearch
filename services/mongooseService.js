const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://elastic_project-mongo-1:27017/mydb', { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => {
console.log("Connected to MongoDB successfully");
})
.catch((error) => {
console.error("Error connecting to MongoDB:", error);
});

module.exports = mongoose;
