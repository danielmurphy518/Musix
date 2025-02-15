const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path to your User model

// MongoDB Atlas connection string
const atlasConnectionString = process.env.MONGO_URI;


// Connect to MongoDB Atlas
mongoose.connect(atlasConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    migrateActivatedField();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });

// Migration function
async function migrateActivatedField() {
  try {
    // Update all users where the `activated` field does not exist
    const result = await User.updateMany(
      { activated: { $exists: false } }, // Find users without the `activated` field
      { $set: { activated: true } }      // Set `activated` to true
    );

    console.log(`Updated ${result.nModified} users.`);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}