require('dotenv').config(); // ✅ Load environment variables first
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const resetDatabase = async () => {
  try {
    await connectDB(); // ✅ Connect to MongoDB

    // 🔹 Drop all collections
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
      console.log(`✅ Dropped collection: ${collection.collectionName}`);
    }

    console.log("✅ Database reset successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Database reset failed:", err);
    process.exit(1);
  }
};

// Run the reset function
resetDatabase();
