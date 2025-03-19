const express = require('express')
const { getLastJobUpdateTimestamp } = require('../config/db')
const { fetchAndSaveJobs } = require('../controllers/remoteJobsController')

module.exports = (jobsContainer) => {
  if (!jobsContainer) {
    throw new Error('❌ jobsContainer is undefined in jobsRoutes!')
  }

  const router = express.Router()

  // ✅ GET all jobs (Fetch from API if empty)
  router.get('/', async (req, res) => {
    try {
      console.log('🔍 Fetching jobs from database...')
      const { resources } = await jobsContainer.items.readAll().fetchAll()

      // ✅ Remove timestamp entry from response
      const filteredJobs = resources.filter((job) => job.id !== 'last_update_timestamp')

      if (filteredJobs.length === 0) {
        console.warn('⚠ No jobs found in database. Fetching from Remotive API...')
        await fetchAndSaveJobs(jobsContainer)
        const { resources: newJobs } = await jobsContainer.items.readAll().fetchAll()
        return res.json(newJobs.filter((job) => job.id !== 'last_update_timestamp'))
      }

      res.json(filteredJobs)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
      res.status(500).json({ error: 'Failed to fetch jobs' })
    }
  })

  // ✅ GET last update timestamp
  router.get('/last-update', async (req, res) => {
    try {
      const lastUpdate = await getLastJobUpdateTimestamp(jobsContainer)
      if (!lastUpdate) {
        console.log('⚠ No last update timestamp found. Creating initial timestamp...')
        const now = new Date().toISOString()
        await jobsContainer.items.upsert({ id: 'last_update_timestamp', timestamp: now })
        return res.json({ lastUpdate: now })
      }
      res.json({ lastUpdate: lastUpdate.toISOString() })
    } catch (error) {
      console.error('❌ Error retrieving last update timestamp:', error)
      res.status(500).json({ error: 'Failed to retrieve last update time' })
    }
  })

  // ✅ Manually Trigger Job Update (Only if 6+ hours passed)
  router.get('/update', async (req, res) => {
    try {
      console.log('🔄 Checking last job update timestamp...')
      const lastUpdate = await getLastJobUpdateTimestamp(jobsContainer)
      const now = new Date()

      console.log('🔄 Requesting job update from Remotive API...')
      await fetchAndSaveJobs(jobsContainer)
      await jobsContainer.items.upsert({
        id: 'last_update_timestamp',
        timestamp: now.toISOString(),
      })

      res.json({ message: 'Jobs updated successfully' })
    } catch (error) {
      console.error('❌ Error updating jobs:', error)
      res.status(500).json({ error: 'Failed to update jobs' })
    }
  })

  return router
}
