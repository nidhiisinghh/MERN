const mongoose = require('mongoose'); 

const mongoUrl = "mongodb://localhost:27017/practice"; 
mongoose.connect(mongoUrl)
    .then(() => console.log("Connected to database."))
    .catch((err) => console.error("Database connection error:", err));

module.exports = mongoose;
    