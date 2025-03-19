require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { setupDatabase } = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const jobsRoutes = require('./routes/jobs')
const userRoutes = require('./routes/users')

const app = express()
app.use(express.json())
app.use(cors())

const startServer = async () => {
  try {
    console.log('🔄 Setting up database...')
    const { users, jobs } = await setupDatabase()

    if (!users || !jobs) {
      throw new Error(
        '❌ Database containers are undefined after setupDatabase(). Check CosmosDB connection.',
      )
    }

    console.log(`✅ Database initialized successfully.`)

    // ✅ Pass `users` and `jobs` containers when initializing routes
    app.use('/api/auth', authRoutes(users))
    app.use('/api/jobs', jobsRoutes(jobs)) // ✅ Pass jobsContainer
    app.use('/api/users', userRoutes(users)) // ✅ Pass usersContainer

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  } catch (error) {
    console.error('❌ Server Startup Error:', error)
    process.exit(1)
  }
}

startServer()
