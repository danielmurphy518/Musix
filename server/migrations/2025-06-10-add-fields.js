// migrations/add-average-rating.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Track = require('../models/Track'); // Adjust path as needed

const atlasConnectionString = process.env.MONGO_URI;

mongoose.connect(atlasConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    addAverageRatingField();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err);
  });

async function addAverageRatingField() {
  try {
    // Simply add default fields to all movies
    const result = await Track.updateMany(
      {}, // Target all documents
      { 
        $set: { 
          average_rating: 0,    // Default value
          review_count: 0       // Default value
        } 
      },
      { upsert: false } // Don't create new docs, just update existing
    );

    console.log(`Successfully added fields to ${result.nModified} movies`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    mongoose.connection.close();
  }
}