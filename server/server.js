// Import dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');  // Import cors
const User = require('./models/User');
const Track = require('./models/Track');  // Import User model
const Review = require('./models/Review');

const app = express();
const port = 4000;

// MongoDB URI from .env
const mongoURI = process.env.MONGO_URI;

// CORS options

const corsOptions = {
  origin: '*', // Allow all origins temporarily for debugging
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  credentials: true,
};

app.use(cors(corsOptions));


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

// Route to register a new user
app.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;
  
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    let hashedpass = await bcrypt.hash(password, 10);
    // Create a new user and save to the database
    const newUser = new User({
      name,
      username,
      email,
      password: hashedpass  // Storing plain password (no hashing)
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route to login (authenticate) a user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the entered password with the stored password (hashed)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,  // Secret key for signing the JWT
      { expiresIn: '1h' }      // Token expiration time (1 hour)
    );

    // Return the token along with user details
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in user' });
  }
});



// Route to get user information (protected)
app.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user)

    res.json(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

app.post('/tracks', async (req, res) => {
  const { artist, track_name, image } = req.body;

  if (!artist || !track_name) {
    return res.status(400).json({ message: 'Artist and track name are required' });
  }

  try {
    const newTrack = new Track({ artist, track_name, image });
    const savedTrack = await newTrack.save();
    res.status(201).json(savedTrack);
  } catch (err) {
    console.error('Error creating track:', err);
    res.status(500).json({ message: 'Error creating track' });
  }
});

app.get('/tracks', async (req, res) => {
  try {
    const tracks = await Track.find();
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks:', err);
    res.status(500).json({ message: 'Error fetching tracks' });
  }
});

app.get('/tracks/recent', async (req, res) => {
  try {
    const recentTracks = await Track.find().sort({ _id: -1 }).limit(5);
    res.json(recentTracks);
  } catch (err) {
    console.error('Error fetching recent tracks:', err);
    res.status(500).json({ message: 'Error fetching recent tracks' });
  }
});

app.get('/track/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const track = await Track.findById(trackId);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/reviews', async (req, res) => {
  const { userId, trackId, content, rating } = req.body;
  
  if (!userId || !trackId || !content || !rating) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newReview = new Review({
      user: userId,
      track: trackId,
      content,
      rating,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Error creating review' });
  }
});

app.get('/reviews/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userReviews = await Review.find({ user: userId })
      .populate('track', 'track_name artist') // Populate track details
      .populate('user', 'username'); // Populate user details
    res.json(userReviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
});

// Route to fetch reviews for a specific track
app.get('/reviews/track/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const trackReviews = await Review.find({ track: trackId })
      .populate('track', 'track_name artist id') // Populate track details
      .populate('user', 'username name'); // Populate user details
    res.json(trackReviews);
  } catch (err) {
    console.error('Error fetching track reviews:', err);
    res.status(500).json({ message: 'Error fetching track reviews' });
  }
});

app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by their ID and select only the fields we want (name, username)
    const user = await User.findById(userId).select('name username');
    
    // If no user is found, return a 404 response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch reviews for this user and populate the associated track data
    const reviews = await Review.find({ user: userId })
      .populate('track', 'track_name artist') // Only fetch track_name and artist from Track
      .select('content rating'); // Fetch only review content and rating

    // Return user data along with reviews
    res.json({ user, reviews });
  } catch (err) {
    console.error('Error fetching user by ID with reviews:', err);
    res.status(500).json({ message: 'Error fetching user and reviews' });
  }
});

//this is extremely dangerous and should never be used, ever.
app.delete('/reviews', async (req, res) => {
  try {
    // Delete all reviews
    await Review.deleteMany({});
    res.status(200).json({ message: 'All reviews have been cleared' });
  } catch (err) {
    console.error('Error clearing reviews:', err);
    res.status(500).json({ message: 'Error clearing reviews' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
