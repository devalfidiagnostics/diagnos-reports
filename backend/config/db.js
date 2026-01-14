const mongoose = require('mongoose');

console.log("🌍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔗 MONGO_URI_PROD:", process.env.MONGO_URI_PROD);
console.log("🔗 MONGO_URI_DEV:", process.env.MONGO_URI_DEV);

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI_PROD
      : process.env.MONGO_URI_DEV;

    console.log("🛠 Using MONGO_URI:", MONGO_URI);

    // 🚀 PHASE 3: Optimized connection options for high-performance bulk operations
    const options = {
      // Connection Pool Settings (critical for performance)
      maxPoolSize: 50,              // Maximum number of connections (default: 10)
      minPoolSize: 10,               // Minimum number of connections (default: 0)
      maxIdleTimeMS: 60000,          // Close idle connections after 60 seconds
      
      // Socket Settings
      socketTimeoutMS: 45000,        // Socket timeout (45s for large operations)
      serverSelectionTimeoutMS: 10000, // Server selection timeout
      
      // Retry Settings
      retryWrites: true,             // Retry write operations
      retryReads: true,              // Retry read operations
      
      // Performance Settings
      directConnection: false,       // Allow load balancing across replica set
      compressors: ['zlib'],         // Enable compression for network traffic
      
      // Additional Settings
      family: 4,                     // Use IPv4
      heartbeatFrequencyMS: 10000,   // Check server health every 10s
      
      // Write Concern (for bulk operations)
      w: 'majority',                 // Wait for majority write acknowledgment
      wtimeoutMS: 30000,             // Write timeout
    };

    const conn = await mongoose.connect(MONGO_URI, options);

    // Log connection pool stats
    console.log(`>>MongoDB Connected to ${process.env.NODE_ENV} DB: ${conn.connection.host}`);
    //console.log(`🔧 Connection Pool: maxPoolSize=${options.maxPoolSize}, minPoolSize=${options.minPoolSize}`);
    //console.log(`⚡ Performance optimizations: Enabled`);
    
    // Monitor connection pool events in development
    if (process.env.NODE_ENV !== 'production') {
      mongoose.connection.on('connected', () => {
        console.log('📊 [POOL] Connection established');
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('📊 [POOL] Connection disconnected');
      });
    }
    
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB");
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
