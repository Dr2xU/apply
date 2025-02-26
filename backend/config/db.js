// config/db.js
require('dotenv').config() // ✅ Load environment variables
const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI
    if (!mongoURI) {
      throw new Error('Missing MONGO_URI in .env file') // ✅ Ensure MONGO_URI exists
    }

    mongoose.set('strictQuery', true) // ✅ Suppress deprecation warnings
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ MongoDB Connected Successfully')
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err)
    process.exit(1)
  }
}

module.exports = connectDB
