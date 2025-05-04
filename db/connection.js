// const mongoose = require('mongoose'); 

// const mongoURL = process.env.mongoURL || "mongodb://localhost:27017/practice"; 
// mongoose.connect(mongoURL)
//     .then(() => console.log("Connected to database."))
//     .catch((err) => console.error("Database connection error:", err));

// module.exports = mongoose;

const mongoose = require('mongoose'); 
const mongoURL = process.env.mongoURL || "mongodb://localhost:27017/practice"; 
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 // Add timeout
        });
        console.log("Connected to database.");
        return mongoose;
    } catch (err) {
        console.error("Database connection error:", err);
        process.exit(1); // Exit if cannot connect to database
    }
};
// Export the connection function instead of calling it immediately
module.exports = connectDB;