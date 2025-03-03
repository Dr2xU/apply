const { container } = require('../config/db')

// 🔹 Add a job
const addJob = async (jobData) => {
  try {
    jobData.id = Date.now().toString() // Unique ID for Cosmos DB
    const { resource } = await container.items.create(jobData)
    return resource
  } catch (error) {
    console.error('❌ Error adding job:', error.message || error)
    throw new Error('Failed to add job')
  }
}

// 🔹 Get all jobs
const getJobs = async () => {
  try {
    const { resources } = await container.items
      .query('SELECT * FROM c ORDER BY c.publication_date DESC') // ✅ Sorted at DB level
      .fetchAll()
    return resources
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message || error)
    throw new Error('Failed to fetch jobs')
  }
}

// 🔹 Update jobs: Fetch new jobs and remove outdated ones
const updateJobs = async (newJobs) => {
  try {
    console.log('🔄 Updating jobs...')

    // ✅ Step 1: Fetch old jobs
    const { resources: oldJobs } = await container.items.readAll().fetchAll()

    // ✅ Step 2: Delete old jobs (if any exist)
    if (oldJobs.length > 0) {
      console.log(`🗑️ Deleting ${oldJobs.length} old jobs...`)
      for (const job of oldJobs) {
        await container.item(job.id, job.id).delete()
      }
    }

    // ✅ Step 3: Insert new jobs
    console.log(`✅ Adding ${newJobs.length} new jobs...`)
    const insertedJobs = []
    for (const job of newJobs) {
      job.id = Date.now().toString() // Unique ID for Cosmos DB
      const { resource } = await container.items.create(job)
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
