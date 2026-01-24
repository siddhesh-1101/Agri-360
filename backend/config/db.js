/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri360';
    
    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('❌ Error connecting to MongoDB:');
    console.error('Error details:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('1. Make sure MongoDB is installed and running');
      console.error('2. Check if MongoDB service is started: mongod --version');
      console.error('3. Verify the connection string in your .env file');
      console.error('4. For Windows: Check if MongoDB service is running in Services');
      console.error('5. Try connecting manually: mongosh mongodb://localhost:27017/agri360');
    }
    
    // Don't exit immediately - let the server start but log the error
    // The server can still run and show helpful error messages
    console.error('\n⚠️  Server will continue to start, but database operations will fail until MongoDB is connected.');
  }
};

module.exports = connectDB;
