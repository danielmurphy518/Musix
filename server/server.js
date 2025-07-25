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
const { sendEmail } = require("./send_email.js"); // Import the email service
const { clearReviews, clearUsers, clearAllData } = require('./services/clearData'); // Importing helper functions
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
      password: hashedpass,  // Storing plain password (no hashing),
      activated: false
    });

    await newUser.save();

    const verificationLink = `http://localhost:3000/verify/${newUser._id}`;

    // Send activation email
    await sendEmail(
      newUser.email,
      'Activate your Music App account',
      'complete_signup',  // your template file without extension, e.g., signup.html
      {
        name: newUser.name,
        verificationLink,
      }
    );


    res.status(201).json({ success: true, message: 'User registered successfully' });
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
    return res.json(null);  // Return null if no token is provided
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the decoded token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.json(null);  // Return null if the user is not found
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});


app.post('/tracks', async (req, res) => {
  const { artist, track_name, image, isFeatured } = req.body;

  try {
    const newTrack = new Track({
      artist,
      track_name,
      image,
      isFeatured: isFeatured || false, // Defaults to false if not provided
    });

    await newTrack.save();
    res.status(201).json(newTrack);
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

app.get('/track/featured', async (req, res) => {
  try {
    const featuredTrack = await Track.findOne({ isFeatured: true });

    if (!featuredTrack) {
      return res.status(404).json({ message: 'No featured track found' });
    }
    
    res.json(featuredTrack);
  } catch (err) {
    console.error('Error fetching featured track:', err);
    res.status(500).json({ message: 'Error fetching featured track' });
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
    // Check if the user has already reviewed this track
    const existingReview = await Review.findOne({ user: userId, track: trackId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this track' });
    }

    // Create and save the new review
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
      .populate('user', 'username', 'interests'); // Populate user details
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
  console.log("this called?")
  const { userId } = req.params;

  try {
    // Find the user by their ID and select only the fields we want (name, username)
    const user = await User.findById(userId).select('name username bio interests');
    
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

app.get('/network/users-reviewed-same-tracks', async (req, res) => {
  try {
    // Step 1: Fetch all reviews, only user, track, and rating fields
    const reviews = await Review.find({}, 'user track rating').lean();

    // Step 2: Build a map: trackId -> array of { userId, rating }
    const trackToUsers = {};
    reviews.forEach(({ user, track, rating }) => {
      const trackId = track.toString();
      const userId = user.toString();

      if (!trackToUsers[trackId]) {
        trackToUsers[trackId] = [];
      }
      trackToUsers[trackId].push({ userId, rating });
    });

    // Step 3: Build edges between users who reviewed the same track,
    // with color based on their ratings on that track
    const edgesMap = new Map(); // key: "userId1-userId2", value: { from, to, color }

    Object.values(trackToUsers).forEach((userRatings) => {
      // For every unique pair of users, create/update an edge
      for (let i = 0; i < userRatings.length; i++) {
        for (let j = i + 1; j < userRatings.length; j++) {
          const userA = userRatings[i];
          const userB = userRatings[j];

          // Determine edge key (sorted to avoid duplicates)
          const [id1, id2] = [userA.userId, userB.userId].sort();
          const edgeKey = `${id1}-${id2}`;

          // Determine color for this pair on this track:
          // Green if both positive (>=3), Red if both negative (<3), else skip
          const bothPositive = userA.rating >= 3 && userB.rating >= 3;
          const bothNegative = userA.rating < 3 && userB.rating < 3;

          // We only care about edges where both are positive or both are negative
          if (!bothPositive && !bothNegative) continue;

          // Color for this pair's edge
          const color = bothPositive ? 'green' : 'red';

          // If edge exists, we want to update color if green (priority to green)
          if (edgesMap.has(edgeKey)) {
            const existing = edgesMap.get(edgeKey);
            // Upgrade red edge to green if this track shows green condition
            if (color === 'green' && existing.color !== 'green') {
              existing.color = 'green';
              edgesMap.set(edgeKey, existing);
            }
          } else {
            // Add new edge
            edgesMap.set(edgeKey, { from: id1, to: id2, color });
          }
        }
      }
    });

    // Step 4: Prepare edges array for graph
    const edges = Array.from(edgesMap.values());

    // Step 5: Fetch all users (nodes), even if no edges
    const allUserIds = await User.find({}).select('name username').lean();

    // Step 6: Build nodes array for graph
    const nodes = allUserIds.map((u) => ({
      id: u._id.toString(),
      label: u.name || u.username || 'Unknown',
    }));

    res.json({ nodes, edges });
  } catch (err) {
    console.error('Error building network graph:', err);
    res.status(500).json({ error: 'Failed to build network graph' });
  }
});


app.get('/network/user-links/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Step 1: Fetch all reviews
    const reviews = await Review.find({}, 'user track rating').lean();
    // Step 2: Build trackId -> [{ userId, rating }]
    const trackToUsers = {};
    reviews.forEach(({ user, track, rating }) => {
      const tId = track.toString();
      const uId = user.toString();
      if (!trackToUsers[tId]) trackToUsers[tId] = [];
      trackToUsers[tId].push({ userId: uId, rating });
    });
    // Step 3: Create user-user edges
    const edgesMap = new Map();
    Object.values(trackToUsers).forEach((userRatings) => {
      for (let i = 0; i < userRatings.length; i++) {
        for (let j = i + 1; j < userRatings.length; j++) {
          const a = userRatings[i];
          const b = userRatings[j];
          const [id1, id2] = [a.userId, b.userId].sort();
          const edgeKey = `${id1}-${id2}`;
          const bothPositive = a.rating >= 3 && b.rating >= 3;
          const bothNegative = a.rating < 3 && b.rating < 3;
          if (!bothPositive && !bothNegative) continue;
          const color = bothPositive ? 'green' : 'red';
          if (edgesMap.has(edgeKey)) {
            const existing = edgesMap.get(edgeKey);
            if (color === 'green' && existing.color !== 'green') {
              existing.color = 'green';
              edgesMap.set(edgeKey, existing);
            }
          } else {
            edgesMap.set(edgeKey, { from: id1, to: id2, color });
          }
        }
      }
    });
    const edges = Array.from(edgesMap.values());
    // Step 4: Find user links
    const positiveIds = new Set();
    const negativeIds = new Set();
    edges.forEach(({ from, to, color }) => {
      if (from === userId) {
        color === 'green' ? positiveIds.add(to) : negativeIds.add(to);
      } else if (to === userId) {
        color === 'green' ? positiveIds.add(from) : negativeIds.add(from);
      }
    });
    const allLinkedUserIds = Array.from(new Set([...positiveIds, ...negativeIds]));
    // Step 5: Fetch linked users and interests
    const users = await User.find({ _id: { $in: allLinkedUserIds } })
      .select('interests')
      .lean();
    const usersMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));
    const positiveUsers = Array.from(positiveIds).map(id => usersMap[id]).filter(Boolean);
    const negativeUsers = Array.from(negativeIds).map(id => usersMap[id]).filter(Boolean);
    // Step 6: Count interests by sentiment
    const interestScores = {};
    const countInterests = (users, direction) => {
      const delta = direction === 'positive' ? 1 : -1;
      users.forEach(user => {
        (user.interests || []).forEach(interest => {
          const key = interest.trim().toLowerCase();
          interestScores[key] = (interestScores[key] || 0) + delta;
        });
      });
    };
    countInterests(positiveUsers, 'positive');
    countInterests(negativeUsers, 'negative');
    const allInterests = Object.entries(interestScores)
      .map(([interest, net_score]) => ({ interest, net_score }))
      .filter(i => i.net_score !== 0);
    // Step 7: Sort top +ve and -ve
    const topPositiveInterests = allInterests
      .filter(i => i.net_score > 0)
      .sort((a, b) => b.net_score - a.net_score)
      .slice(0, 5);
    const topNegativeInterests = allInterests
      .filter(i => i.net_score < 0)
      .sort((a, b) => a.net_score - b.net_score)
      .slice(0, 5);
    // Step 8: Return final result
    res.json({
      userId,
      top_positive_interests: topPositiveInterests,
      top_negative_interests: topNegativeInterests
    });
  } catch (err) {
    console.error('Error building interest score:', err);
    res.status(500).json({ error: 'Failed to analyze user interest sentiment' });
  }
});



//this is extremely dangerous and should never be used, ever.
app.delete('/reviews', async (req, res) => {
  try {
    const result = await clearReviews();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/users', async (req, res) => {
  try {
    const result = await clearUsers();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/clear-all', async (req, res) => {
  try {
    const result = await clearAllData();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.delete('/review/:reviewId', async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully', review: deletedReview });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

app.patch('/reviews/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;

  if (!content && rating === undefined) {
    return res.status(400).json({ message: 'Content or rating is required to update the review' });
  }

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (content) review.content = content;
    if (rating !== undefined) review.rating = rating;

    const updatedReview = await review.save();

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Error updating review' });
  }
});

app.post("/send-email", async (req, res) => {
  const { to, subject, templateName, templateData } = req.body;
  try {
    // Send email with the chosen template and data
    await sendEmail(to, subject, templateName, templateData);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});


app.delete('/delete-inactive-users', async (req, res) => {
  try {
    const result = await User.deleteMany({ activated: false });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} inactive user(s) deleted`
    });
  } catch (err) {
    console.error('Error deleting inactive users:', err);
    res.status(500).json({ message: 'Error deleting inactive users' });
  }
});

app.get('/verify/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.activated) {
      return res.send('Account already activated');
    }

    user.activated = 1; // or true, depending on your schema
    await user.save();

    // Optionally redirect to login or success page
    res.send('Account activated successfully! You can now log in.');

    // Or, for redirect:
    // res.redirect('https://your-app.com/login');
    //console.log("ahhhhhh")

  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/ping', (req, res) => {
  res.send('pong')
});

// Start the server
//An error here likely is linked to Mongo Credentials
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
