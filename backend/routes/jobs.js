const express = require('express')

module.exports = (jobs) => {
  if (!jobs) {
    throw new Error('❌ jobs container is undefined in jobsRoutes!')
  }

  const router = express.Router()

  // ✅ GET all jobs
  router.get('/', async (req, res) => {
    try {
      const { resources } = await jobs.items.readAll().fetchAll()
      res.json(resources)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
      res.status(500).json({ error: 'Failed to fetch jobs' })
    }
  })

  // ✅ Manually update jobs (trigger fetch from Remotive API)
  router.get('/update', async (req, res) => {
    try {
      const response = await fetch('https://remotive.com/api/remote-jobs')
      const { jobs: newJobs } = await response.json()

      if (!newJobs || newJobs.length === 0) {
        return res.status(400).json({ error: 'No new jobs found' })
      }

      console.log(`🔄 Updating ${newJobs.length} jobs...`)

      // Delete old jobs
      const { resources: oldJobs } = await jobs.items.readAll().fetchAll()
      for (const job of oldJobs) {
        await jobs.item(job.id, job.id).delete()
      }

      // Insert new jobs
      for (const job of newJobs) {
        job.id = Date.now().toString()
        await jobs.items.create(job)
      }

      console.log('✅ Jobs successfully updated!')
      res.json({ message: 'Jobs updated successfully', jobCount: newJobs.length })
    } catch (error) {
      console.error('❌ Error updating jobs:', error)
      res.status(500).json({ error: 'Failed to update jobs' })
    }
  })

  return router
}
