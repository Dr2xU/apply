const express = require('express')

module.exports = (usersContainer) => {
  if (!usersContainer) {
    throw new Error('❌ usersContainer is undefined in usersRoutes!')
  }

  const router = express.Router()

  // ✅ Mark Job as Viewed
  router.post('/view-job', async (req, res) => {
    try {
      const { userId, jobId } = req.body

      if (!userId || !jobId) {
        return res.status(400).json({ error: 'Missing userId or jobId' })
      }

      console.log(`📌 Received request: userId=${userId}, jobId=${jobId}`)

      // ✅ Find User
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

      // ✅ Ensure viewedJobs array exists
      if (!user.viewedJobs) {
        user.viewedJobs = []
      }

      // ✅ Add jobId if it's not already in viewedJobs
      if (!user.viewedJobs.includes(jobId)) {
        user.viewedJobs.push(jobId)
      }

      // ✅ Update User Record
      await usersContainer.item(user.id, user.id).replace(user)

      console.log(`✅ Job ${jobId} marked as viewed for user ${user.email}`)
      res.json({ message: 'Job marked as viewed', viewedJobs: user.viewedJobs })
    } catch (error) {
      console.error('❌ Error marking job as viewed:', error)
      res.status(500).json({ error: 'Failed to mark job as viewed' })
    }
  })

  // ✅ Get Viewed Jobs for User
  router.get('/viewed-jobs', async (req, res) => {
    try {
      const { userId } = req.query

      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' })
      }

      console.log(`📌 Fetching viewed jobs for userId=${userId}`)

      // ✅ Find User
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

      console.log('✅ Viewed Jobs:', user.viewedJobs || [])
      res.json(user.viewedJobs || [])
    } catch (error) {
      console.error('❌ Error fetching viewed jobs:', error)
      res.status(500).json({ error: 'Failed to fetch viewed jobs' })
    }
  })

  return router
}
