const mongoose = require("mongoose");
const colors = require("colors");


const connectDB = async() => {
    try {
        const conn =  await mongoose.connect(process.env.MONGODB_URI, {
    
          
        });
        console.log(`MongoDB Connected ${conn.connection.host}`.cyan.bold );
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`.red.bold);
        process.exit(1);
    }
}

module.exports = connectDB;
