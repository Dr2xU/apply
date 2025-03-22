/**
 * Job Routes
 *
 * Handles job-related API endpoints, including fetching, updating,
 * and retrieving the last update timestamp from the database.
 */

const express = require('express')
const { getLastJobUpdateTimestamp } = require('../config/db')
const { fetchAndSaveJobs } = require('../controllers/remoteJobsController')
const NodeCache = require('node-cache')

// Cache duration: 5 minutes
const cache = new NodeCache({ stdTTL: 300 })

/**
 * Configures job-related routes.
 * @param {Object} jobsContainer - The CosmosDB container for jobs.
 * @returns {express.Router} Configured Express router.
 */
module.exports = (jobsContainer) => {
  if (!jobsContainer) {
    throw new Error('❌ jobsContainer is undefined in jobsRoutes!')
  }

  const router = express.Router()

  /**
   * GET / - Retrieve all jobs from the database.
   * If no jobs are found, fetch from the Remotive API.
   */
  router.get('/', async (req, res) => {
    try {
      // Check cache first
      const cachedJobs = cache.get('jobs')
      if (cachedJobs) {
        return res.json(cachedJobs)
      }

      console.log('🔍 Fetching jobs from database...')
      const querySpec = {
        query: "SELECT * FROM c WHERE c.id != 'last_update_timestamp' OFFSET 0 LIMIT 1000",
      }
      const { resources } = await jobsContainer.items.query(querySpec).fetchAll()

      if (resources.length === 0) {
        console.warn('⚠ No jobs found. Fetching from API...')
        await fetchAndSaveJobs(jobsContainer)

        // After fetching and saving, get only 100 jobs
        const { resources: newJobs } = await jobsContainer.items.query(querySpec).fetchAll()

        return res.json(newJobs)
      }

      // Cache jobs for 5 minutes
      cache.set('jobs', resources)
      res.json(resources)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
      res.status(500).json({ error: 'Failed to fetch jobs' })
    }
  })

  /**
   * GET /last-update - Retrieve the last update timestamp.
   * If no timestamp exists, create an initial timestamp entry.
   */
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

  /**
   * GET /update - Manually trigger job update (only if 6+ hours have passed).
   */
  router.get('/update', async (req, res) => {
    try {
      const forceUpdate = req.query.force === 'true'
      console.log(`🔄 Job update request received. Force update: ${forceUpdate}`)

      const lastUpdate = await getLastJobUpdateTimestamp(jobsContainer)
      const now = new Date()

      // Skip time check if force is true
      if (!forceUpdate && lastUpdate && now - new Date(lastUpdate) < 6 * 60 * 60 * 1000) {
        return res.json({
          message: 'Jobs were updated less than 6 hours ago.',
          lastUpdate: lastUpdate,
        })
      }

      // Clear any existing cache
      cache.del('jobs')

      // Fetch and save new jobs
      const result = await fetchAndSaveJobs(jobsContainer)

      // Update the timestamp
      await jobsContainer.items.upsert({
        id: 'last_update_timestamp',
        timestamp: now.toISOString(),
      })

      res.json({
        message: 'Jobs updated successfully',
        jobCount: result.jobCount || 0,
        timestamp: now.toISOString(),
      })
    } catch (error) {
      console.error('❌ Error updating jobs:', error)
      res.status(500).json({ error: 'Failed to update jobs', details: error.message })
    }
  })

  return router
}
