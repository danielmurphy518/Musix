const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

// Mongoose connection options for modern versions (v6+)
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
};

let cachedConnection = null;

module.exports.connectToDatabase = async () => {
  if (cachedConnection) {
    console.log('=> using cached database connection');
    return cachedConnection;
  }

  console.log('=> using new database connection');
  cachedConnection = await mongoose.connect(mongoURI, mongooseOptions);
  return cachedConnection;
};