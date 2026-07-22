const mongoose = require('mongoose');

/**
 * Production-ready MongoDB Atlas Connection Manager using Mongoose
 */

const MAX_RETRIES = parseInt(process.env.DB_MAX_RETRIES, 10) || 5;
const RETRY_INTERVAL = parseInt(process.env.DB_RETRY_INTERVAL_MS, 10) || 3000;

let currentRetry = 0;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MongoDB URI is not defined in environment variables.');
    process.exit(1);
  }

  // Set Mongoose global configuration options
  mongoose.set('strictQuery', true);

  // Setup Mongoose connection event listeners
  mongoose.connection.on('connected', () => {
    console.log(`✅ MongoDB Atlas connected successfully to host: ${mongoose.connection.host}`);
    currentRetry = 0;
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ Mongoose connection lost. Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 Mongoose connection restored.');
  });

  const attemptConnection = async () => {
    try {
      await mongoose.connect(mongoUri);
    } catch (error) {
      currentRetry += 1;
      console.error(
        `❌ MongoDB initial connection failed (Attempt ${currentRetry}/${MAX_RETRIES}): ${error.message}`
      );

      if (currentRetry < MAX_RETRIES) {
        console.log(`⏱️ Retrying database connection in ${RETRY_INTERVAL / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
        return attemptConnection();
      } else {
        console.error('💥 Exceeded maximum MongoDB connection retries. Terminating process.');
        process.exit(1);
      }
    }
  };

  await attemptConnection();
};

/**
 * Gracefully close database connection on process shutdown
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed gracefully.');
  } catch (error) {
    console.error(`❌ Error closing MongoDB connection: ${error.message}`);
  }
};

// Handle process termination events for graceful shutdown
const setupGracefulShutdown = () => {
  const handleShutdown = async (signal) => {
    console.log(`\n⚠️ Received ${signal}. Closing MongoDB connection...`);
    await disconnectDB();
    process.exit(0);
  };

  process.once('SIGINT', () => handleShutdown('SIGINT'));
  process.once('SIGTERM', () => handleShutdown('SIGTERM'));
};

setupGracefulShutdown();

module.exports = {
  connectDB,
  disconnectDB,
};
