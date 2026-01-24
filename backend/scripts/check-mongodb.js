/**
 * MongoDB Connection Check Script
 * Tests MongoDB connection before starting the server
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function checkMongoDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri360';
  
  console.log('🔍 Checking MongoDB connection...');
  console.log(`📍 URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}\n`);

  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connection successful!');
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected'}\n`);

    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully.\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed!\n');
    console.error('Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Troubleshooting steps:\n');
      console.error('1. Check if MongoDB is installed:');
      console.error('   mongod --version\n');
      console.error('2. Start MongoDB service:');
      console.error('   Windows: net start MongoDB');
      console.error('   Mac/Linux: sudo systemctl start mongod\n');
      console.error('3. Check MongoDB is running on default port:');
      console.error('   mongosh mongodb://localhost:27017\n');
      console.error('4. For MongoDB Atlas (cloud):');
      console.error('   - Check your connection string in .env file');
      console.error('   - Verify your IP is whitelisted\n');
    }
    
    process.exit(1);
  }
}

checkMongoDB();
