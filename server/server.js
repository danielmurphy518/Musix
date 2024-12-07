require('dotenv').config();  // Load .env file
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');  // Import User model
const app = express();
const port = 5000;

// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to retrieve all users
app.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();
    res.json(users);  // Send the users as a response
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post('/users', async (req, res) => {
  const { name, username, email, password } = req.body;
  
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create a new user document
    const newUser = new User({
      name,
      username,
      email,
      password  // In a real app, you should hash the password
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});
