const mongoose = require("mongoose");

// Define the Track schema
const TrackSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  track_name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL for the track image
    required: false, // Not required initially
  },
}, { timestamps: true }); // Add createdAt and updatedAt fields

// Export the Track model
const Track = mongoose.model("Track", TrackSchema);

module.exports = Track;
