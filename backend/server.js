/* backend/server.js */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const remoteJobsRoutes = require('./routes/remoteJobs')

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// 🔹 Connect to MongoDB
connectDB()

// 🔹 API Routes
app.use('/api/jobs', remoteJobsRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
