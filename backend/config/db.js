import mongoose from 'mongoose';

const connectDB = async () => {
  // Listen for connection events
  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected! Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected!');
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    // Log a masked version of the URI to verify it's being read
    const uri = process.env.MONGO_URI || '';
    const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log(`Using URI: ${maskedUri}`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MONGODB INITIAL CONNECTION ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
