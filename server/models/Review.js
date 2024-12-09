const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assumes you have a User model
    required: true
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track', // Assumes you have a Track model
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
    validate: {
      validator: (value) => value % 0.5 === 0,
      message: 'Stars must be a multiple of 0.5'
    }
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000 // Set a reasonable limit for text length
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
