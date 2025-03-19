const { jobContainer } = require('../config/db')
const { getLastJobUpdateTimestamp } = require('../config/db')
const crypto = require('crypto') // ✅ Ensures unique IDs

// 🔹 Add a job
const addJob = async (jobData) => {
  try {
    jobData.id = jobData.id ? jobData.id.toString() : crypto.randomUUID() // ✅ Use existing ID or generate a new one
    const { resource } = await jobContainer.items.create(jobData)
    return resource
  } catch (error) {
    console.error('❌ Error adding job:', error.message || error)
    throw new Error('Failed to add job')
  }
}

// 🔹 Get all jobs
const getJobs = async () => {
  try {
    console.time('🔄 DB Query Time') // Measure query time
    const { resources } = await jobContainer.items
      .query('SELECT * FROM c ORDER BY c.publication_date DESC') // ✅ Limit query results
      .fetchAll()
    console.timeEnd('🔄 DB Query Time')
    return resources
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message || error)
    throw new Error('Failed to fetch jobs')
  }
}

// 🔹 Update jobs: Fetch new jobs and remove outdated ones
const updateJobs = async (newJobs) => {
  try {
    console.log('🔄 Checking last job update timestamp...')
    const lastUpdated = await getLastJobUpdateTimestamp()
    const now = new Date()

    // ✅ Enforce 6-hour update rule
    if (lastUpdated && now - lastUpdated < 6 * 60 * 60 * 1000) {
      console.log(`🛑 Skipping job update: Last updated at ${lastUpdated.toISOString()}.`)
      return []
    }

    console.log('🔄 Updating jobs...')

    // ✅ Step 1: Fetch old jobs
    const { resources: oldJobs } = await jobContainer.items.readAll().fetchAll()

    // ✅ Step 2: Delete old jobs
    if (oldJobs.length > 0) {
      console.log(`🗑️ Deleting ${oldJobs.length} old jobs...`)
      for (const job of oldJobs) {
        await jobContainer.item(job.id, job.id).delete()
      }
    }

    // ✅ Step 3: Insert new jobs with unique IDs
    console.log(`✅ Adding ${newJobs.length} new jobs...`)
    const insertedJobs = []
    for (const job of newJobs) {
      job.id = job.id ? job.id.toString() : crypto.randomUUID() // ✅ Use provided ID or generate a new one
      const { resource } = await jobContainer.items.create(job)
      insertedJobs.push(resource)
    }

    console.log('✅ Jobs successfully updated!')
    return insertedJobs
  } catch (error) {
    console.error('❌ Error updating jobs:', error.message || error)
    throw new Error('Failed to update jobs')
  }
}

module.exports = { addJob, getJobs, updateJobs }
