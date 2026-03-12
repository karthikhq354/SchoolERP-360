/* eslint-env node */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connection options (Mongoose 8.x defaults are good, these are explicit)
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if DB not reachable
      socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB connection error: ${err.message}`);
    });

  } catch (error) {
    logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;