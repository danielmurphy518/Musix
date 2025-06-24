const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path as needed

const atlasConnectionString = process.env.MONGO_URI;

mongoose.connect(atlasConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    addBioField();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });

async function addBioField() {
  try {
    const result = await User.updateMany(
      { bio: { $exists: false } }, // Only update if 'bio' doesn't exist
      { $set: { bio: '' } },
      { upsert: false }
    );

    console.log(`Successfully added 'bio' field to ${result.modifiedCount || result.nModified} users`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    mongoose.connection.close();
  }
}
