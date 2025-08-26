// testMongo.js
require('dotenv').config(); // Loads your .env file
const mongoose = require('mongoose');
// Optional: Log the URI to double-check it’s loaded
console.log('MONGO_URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    process.exit(0); // Exit after success
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure
  });