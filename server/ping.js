// ping.js
import 'dotenv/config';           // loads .env automatically
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ Missing MONGODB_URI environment variable");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connection succeeded!");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run();
