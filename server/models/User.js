const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  activated : {
    type: Boolean,
    required:true
  },
  // New "data" field
  data: {
    review_count: {
      type: Number,
      default: 0 // Default value for review_count
    },
    // You can add more fields here as needed
    // Example: total_ratings, last_review_date, etc.
  },

    interests: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 5;
      },
      message: props => `A user can have at most 5 interests, but got ${props.value.length}`
    },
    default: []
  }
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;