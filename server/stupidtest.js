import 'dotenv/config';
import mongoose from 'mongoose';

// ---- Define Models (same as in your app) ----
const ReviewSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.ObjectId,
    track: mongoose.Schema.Types.ObjectId,
    rating: Number,
  },
  { collection: 'reviews' }
);

const UserSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
  },
  { collection: 'users' }
);

const Review = mongoose.model('Review', ReviewSchema);
const User = mongoose.model('User', UserSchema);

// ---- Main Test Logic ----
async function run() {
  console.log('Connecting to MongoDB...');
  const uri = process.env.MONGO_URI;

  const t0 = Date.now();
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    });
    console.log(`✅ Connected in ${Date.now() - t0}ms`);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return process.exit(1);
  }

  try {
    console.log('\n📦 Fetching reviews...');
    const reviews = await Review.find({}, 'user track rating').lean();
    console.log(`→ Got ${reviews.length} reviews`);

    console.log('\n🔗 Building track-to-user map...');
    const trackToUsers = {};
    for (const { user, track, rating } of reviews) {
      const trackId = String(track);
      const userId = String(user);
      (trackToUsers[trackId] ||= []).push({ userId, rating });
    }

    console.log('\n🔍 Building edges...');
    const edgesMap = new Map();
    for (const userRatings of Object.values(trackToUsers)) {
      for (let i = 0; i < userRatings.length; i++) {
        for (let j = i + 1; j < userRatings.length; j++) {
          const a = userRatings[i];
          const b = userRatings[j];
          const [id1, id2] = [a.userId, b.userId].sort();
          const key = `${id1}-${id2}`;

          const bothPos = a.rating >= 3 && b.rating >= 3;
          const bothNeg = a.rating < 3 && b.rating < 3;
          if (!bothPos && !bothNeg) continue;

          const color = bothPos ? 'green' : 'red';
          const existing = edgesMap.get(key);
          if (!existing) edgesMap.set(key, { from: id1, to: id2, color });
          else if (color === 'green' && existing.color !== 'green') existing.color = 'green';
        }
      }
    }

    console.log(`→ Built ${edgesMap.size} edges`);

    console.log('\n👤 Fetching users...');
    const users = await User.find({}, 'name username').lean();
    console.log(`→ Got ${users.length} users`);

    console.log('\n✅ Done!');
    console.log({
      nodes: users.length,
      edges: edgesMap.size,
      sampleEdge: edgesMap.values().next().value,
    });
  } catch (err) {
    console.error('\n❌ Error during graph building:', err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
