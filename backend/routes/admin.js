/**
 * Admin Routes
 *
 * Provides system statistics including total users, total jobs, and last job update timestamp.
 */

const express = require('express')
const { getLastJobUpdateTimestamp } = require('../config/db')

module.exports = (usersContainer, jobsContainer) => {
  if (!usersContainer || !jobsContainer) {
    throw new Error('❌ Database containers are undefined in adminRoutes!')
  }

  const router = express.Router()

  /**
   * GET /api/admin/stats - Retrieve system statistics.
   */
  router.get('/stats', async (req, res) => {
    try {
      console.log('📊 Fetching system statistics...')

      // Get total users count
      const { resources: users } = await usersContainer.items.readAll().fetchAll()
      const totalUsers = users.length

      // Get total jobs count
      const { resources: jobs } = await jobsContainer.items.readAll().fetchAll()
      const totalJobs = jobs.length

      // Get last job update timestamp
      const lastUpdate = await getLastJobUpdateTimestamp(jobsContainer)

      res.json({
        totalUsers,
        totalJobs,
        lastUpdate: lastUpdate ? lastUpdate.toISOString() : 'No updates recorded',
      })
    } catch (error) {
      console.error('❌ Error retrieving system statistics:', error)
      res.status(500).json({ error: 'Failed to retrieve statistics' })
    }
  })

  return router
}
