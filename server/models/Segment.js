const mongoose = require("mongoose");

const SegmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: "",
    trim: true
  },

  // Users belonging to this segment — 0 to infinity
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"   // assumes you have a User model defined elsewhere
  }]

}, { timestamps: true });

module.exports = mongoose.model("Segment", SegmentSchema);
