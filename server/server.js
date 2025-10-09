// Import dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/User");
const Track = require("./models/Track");
const Review = require("./models/Review");

const app = express();
const port = process.env.PORT || 4000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Debug startup log ===
console.log("✅ Starting server.js...");

// === MongoDB Connection ===
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// === Routes ===

// Health check
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// User registration (no email)
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in /register:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// User login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Protected route example
app.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error in /profile:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Example tracks route
app.get("/tracks", async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (error) {
    console.error("Error in /tracks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Example review submission route
app.post("/reviews", async (req, res) => {
  try {
    const { trackId, reviewer, rating, comment } = req.body;
    const review = new Review({ trackId, reviewer, rating, comment });
    await review.save();
    res.json({ message: "Review saved successfully" });
  } catch (error) {
    console.error("Error in /reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// === Global error handlers ===
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// === Start server ===
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${port}`);
});
