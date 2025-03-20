/**
 * Jobs API Service
 *
 * Handles fetching job listings, triggering updates, and retrieving job details.
 */

import axios from 'axios'

const API_URL = 'http://localhost:5000/api/jobs'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Fetches jobs from the backend. If the database is empty, triggers an update and retries.
 * @returns {Promise<Array>} List of job objects.
 * @throws {Error} Throws an error if the job fetch fails.
 */
export const getJobs = async () => {
  try {
    console.time('🔄 Job Fetch Time') // Measure fetch time
    const response = await apiClient.get('/')
    console.timeEnd('🔄 Job Fetch Time') // End time measurement

    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn('⚠ No jobs found in database. Triggering job update...')
      await updateJobs()
      const updatedResponse = await apiClient.get('/')
      return updatedResponse.data
    }

    return response.data.map((job) => ({
      ...job,
      tags: job.tags || [],
      salary: job.salary || 'Not specified',
      candidate_required_location: job.candidate_required_location || 'Worldwide',
      company_logo:
        job.company_logo && job.company_logo.startsWith('http')
          ? job.company_logo
          : 'https://via.placeholder.com/50?text=No+Logo',
    }))
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to load jobs')
  }
}

/**
 * Manually triggers a job update. Checks last update timestamp before requesting.
 * @param {boolean} force - If true, forces an update regardless of last timestamp.
 * @returns {Promise<Object>} Response message from the server.
 * @throws {Error} Throws an error if the update fails.
 */
export const updateJobs = async (force = false) => {
  try {
    console.log('🔍 Checking last job update timestamp...')
    console.time('🔄 Total Job Update Time')

    if (!force) {
      const lastUpdateResponse = await apiClient.get('/last-update')
      const lastUpdate = new Date(lastUpdateResponse.data.lastUpdate)
      const now = new Date()

      if (lastUpdate && now - lastUpdate < 6 * 60 * 60 * 1000) {
        console.log(`🛑 Skipping job update: Last updated at ${lastUpdate.toISOString()}`)
        return { message: 'Job update skipped (last update < 6 hours ago).' }
      }
    }

    console.log(`🔄 Requesting job update${force ? ' (forced)' : ''}...`)
    const response = await apiClient.get(`/update${force ? '?force=true' : ''}`)
    console.timeEnd('🔄 Total Job Update Time')

    return response.data
  } catch (error) {
    console.error('❌ Error updating jobs:', error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to update jobs')
  }
}

/**
 * Fetches job details by job ID.
 * @param {string} jobId - The ID of the job to fetch details for.
 * @returns {Promise<Object>} The job details object.
 * @throws {Error} Throws an error if the job ID is missing or the request fails.
 */
export const getJobById = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('❌ Job ID is required to fetch job details')
    }

    console.log(`🔎 Fetching job details for ID: ${jobId}`)
    const response = await apiClient.get(`/job/${jobId}`)

    return response.data || {}
  } catch (error) {
    console.error(`❌ Error fetching job details (ID: ${jobId}):`, error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to fetch job details')
  }
}
