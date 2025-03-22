/**
 * Remote Job Model
 *
 * Handles job-related operations in CosmosDB, including adding, fetching,
 * and updating job listings with a 6-hour update enforcement rule.
 */

const { jobContainer } = require('../config/db')
const { getLastJobUpdateTimestamp } = require('../config/db')
const crypto = require('crypto')

/**
 * Adds a new job entry to the database.
 * @param {Object} jobData - Job data to be inserted.
 * @returns {Promise<Object>} The newly created job resource.
 */
const addJob = async (jobData) => {
  try {
    jobData.id = jobData.id ? jobData.id.toString() : crypto.randomUUID()
    const { resource } = await jobContainer.items.create(jobData)
    return resource
  } catch (error) {
    console.error('❌ Error adding job:', error.message || error)
    throw new Error('Failed to add job')
  }
}

/**
 * Retrieves all jobs from the database, ordered by publication date.
 * @returns {Promise<Array>} List of job objects.
 */
const getJobs = async () => {
  try {
    console.time('🔄 DB Query Time')
    const queryOptions = {
      maxItemCount: 1000,
    }
    const { resources } = await jobContainer.items
      .query('SELECT * FROM c ORDER BY c.publication_date DESC', queryOptions)
      .fetchAll()
    console.timeEnd('🔄 DB Query Time')
    return resources
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message || error)
    throw new Error('Failed to fetch jobs')
  }
}

/**
 * Updates job listings by removing outdated jobs and inserting new ones.
 * Ensures updates occur only if the last update was more than 6 hours ago.
 * @param {Array} newJobs - Array of new job listings to be added.
 * @returns {Promise<Array>} List of newly added job entries.
 */
const updateJobs = async (newJobs) => {
  try {
    console.log('🔄 Checking last job update timestamp...')
    const lastUpdated = await getLastJobUpdateTimestamp()
    const now = new Date()

    // Enforce 6-hour update rule
    if (lastUpdated && now - lastUpdated < 6 * 60 * 60 * 1000) {
      console.log(`🛑 Skipping job update: Last updated at ${lastUpdated.toISOString()}.`)
      return []
    }

    console.log('🔄 Updating jobs...')

    // Fetch existing jobs
    const { resources: oldJobs } = await jobContainer.items.readAll().fetchAll()

    // Delete outdated jobs if they exist
    if (oldJobs.length > 0) {
      console.log(`🗑️ Deleting ${oldJobs.length} outdated jobs...`)
      await Promise.all(oldJobs.map((job) => jobContainer.item(job.id, job.id).delete()))
    }

    // Insert new jobs with unique IDs
    console.log(`✅ Adding ${newJobs.length} new jobs...`)
    const insertedJobs = await Promise.all(
      newJobs.map(async (job) => {
        try {
          job.id = job.id ? job.id.toString() : crypto.randomUUID()

          // Check if job with this ID already exists
          const { resource: existingJob } = await jobContainer.item(job.id, job.id).read()

          if (existingJob) {
            return existingJob
          } else {
            // Job doesn't exist, create it
            const { resource } = await jobContainer.items.create(job)
            return resource
          }
        } catch (error) {
          if (error.code === 404) {
            // 404 means item doesn't exist, so create it
            const { resource } = await jobContainer.items.create(job)
            return resource
          } else {
            console.error(`❌ Error processing job ${job.id}:`, error.message)
            throw error
          }
        }
      }),
    )

    console.log('✅ Jobs successfully updated!')
    return insertedJobs
  } catch (error) {
    console.error('❌ Error updating jobs:', error.message || error)
    throw new Error('Failed to update jobs')
  }
}

module.exports = { addJob, getJobs, updateJobs }
