/**
 * User Routes
 *
 * Provides endpoints for managing user job interactions, including:
 * - Retrieving job states (seen, saved, applied)
 * - Marking jobs as seen
 * - Saving and unsaving jobs
 * - Deleting saved jobs
 * - Marking jobs as applied
 */

const express = require('express')

/**
 * Configures user-related routes.
 * @param {Object} usersContainer - The CosmosDB container for users.
 * @returns {express.Router} Configured Express router.
 */
module.exports = (usersContainer) => {
  if (!usersContainer) {
    throw new Error('❌ usersContainer is undefined in usersRoutes!')
  }

  const router = express.Router()

  /**
   * GET /user-jobs - Fetch all job states (seen, saved, applied) for a user.
   */
  router.get('/user-jobs', async (req, res) => {
    try {
      const { userId } = req.query
      if (!userId) return res.status(400).json({ error: 'Missing userId' })

      console.log(`📌 Fetching job states for userId=${userId}`)

      const { resources: users } = await usersContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.id = @userId',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll()

      if (users.length === 0) {
        return res.status(404).json({ error: `User not found: ${userId}` })
      }

      const user = users[0]
      res.json({
        seenJobs: user.seenJobs || [],
        savedJobs: user.savedJobs || [],
        appliedJobs: user.appliedJobs || [],
      })
    } catch (error) {
      console.error('❌ Error fetching user job data:', error)
      return res.status(500).json({ error: 'Failed to fetch job data' })
    }
  })

  /**
   * POST /see-job - Mark a job as seen by the user.
   */
  router.post('/see-job', async (req, res) => {
    try {
      const { userId, jobId } = req.body
      if (!userId || !jobId) return res.status(400).json({ error: 'Missing userId or jobId' })

      console.log(`📌 Marking job as seen: userId=${userId}, jobId=${jobId}`)

      const { resources: users } = await usersContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.id = @userId',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll()

      if (users.length === 0) return res.status(404).json({ error: `User not found: ${userId}` })

      const user = users[0]
      user.seenJobs = user.seenJobs || []

      if (!user.seenJobs.includes(jobId)) {
        user.seenJobs.push(jobId)
        await usersContainer.item(user.id, user.id).replace(user)
      }

      res.json({ message: 'Job marked as seen', seenJobs: user.seenJobs })
    } catch (error) {
      console.error('❌ Error marking job as seen:', error)
      return res.status(500).json({ error: 'Failed to mark job as seen' })
    }
  })

  /**
   * POST /save-job - Toggle save/unsave job for a user.
   */
  router.post('/save-job', async (req, res) => {
    try {
      const { userId, jobId } = req.body
      if (!userId || !jobId) return res.status(400).json({ error: 'Missing userId or jobId' })

      console.log(`📌 Toggling saved job: userId=${userId}, jobId=${jobId}`)

      const { resources: users } = await usersContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.id = @userId',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll()

      if (users.length === 0) return res.status(404).json({ error: `User not found: ${userId}` })

      const user = users[0]
      user.savedJobs = user.savedJobs || []

      user.savedJobs.includes(jobId)
        ? (user.savedJobs = user.savedJobs.filter((id) => id !== jobId))
        : user.savedJobs.push(jobId)

      await usersContainer.item(user.id, user.id).replace(user)

      res.json({ message: 'Job save state updated', savedJobs: user.savedJobs })
    } catch (error) {
      console.error('❌ Error updating saved jobs:', error)
      return res.status(500).json({ error: 'Failed to update saved jobs' })
    }
  })

  /**
   * DELETE /delete-saved-job - Remove a saved job from a user's list.
   */
  router.delete('/delete-saved-job', async (req, res) => {
    try {
      const { userId, jobId } = req.body
      if (!userId || !jobId) return res.status(400).json({ error: 'Missing userId or jobId' })

      console.log(`📌 Removing saved job: userId=${userId}, jobId=${jobId}`)

      const { resources: users } = await usersContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.id = @userId',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll()

      if (users.length === 0) return res.status(404).json({ error: `User not found: ${userId}` })

      const user = users[0]
      user.savedJobs = user.savedJobs || []

      if (user.savedJobs.includes(jobId)) {
        user.savedJobs = user.savedJobs.filter((id) => id !== jobId)
        await usersContainer.item(user.id, user.id).replace(user)
      }

      res.json({ message: 'Saved job deleted successfully', savedJobs: user.savedJobs })
    } catch (error) {
      console.error('❌ Error deleting saved job:', error)
      return res.status(500).json({ error: 'Failed to delete saved job' })
    }
  })

  /**
   * POST /apply-job - Mark a job as applied by the user.
   */
  router.post('/apply-job', async (req, res) => {
    try {
      const { userId, jobId } = req.body
      if (!userId || !jobId) return res.status(400).json({ error: 'Missing userId or jobId' })

      console.log(`📌 Marking job as applied: userId=${userId}, jobId=${jobId}`)

      const { resources: users } = await usersContainer.items
        .query({
          query: 'SELECT * FROM c WHERE c.id = @userId',
          parameters: [{ name: '@userId', value: userId }],
        })
        .fetchAll()

      if (users.length === 0) return res.status(404).json({ error: `User not found: ${userId}` })

      const user = users[0]
      user.appliedJobs = user.appliedJobs || []

      if (!user.appliedJobs.includes(jobId)) {
        user.appliedJobs.push(jobId)
        await usersContainer.item(user.id, user.id).replace(user)
      }

      res.json({ message: 'Job marked as applied', appliedJobs: user.appliedJobs })
    } catch (error) {
      console.error('❌ Error marking job as applied:', error)
      return res.status(500).json({ error: 'Failed to mark job as applied' })
    }
  })

  return router
}
