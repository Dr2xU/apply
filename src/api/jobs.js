import axios from 'axios'

// ✅ API Base URL
const API_URL = 'http://localhost:5000/api/jobs'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

// ✅ Fetch Jobs from Backend (Trigger Update if Empty)
export const getJobs = async () => {
  try {
    console.time('🔄 Job Fetch Time') // Measure time
    const response = await apiClient.get('/')
    console.timeEnd('🔄 Job Fetch Time') // End time

    console.log('🔹 API Response:', response.data)

    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn('⚠ No jobs found in database. Triggering job update...')
      await updateJobs() // ✅ If empty, trigger update

      const updatedResponse = await apiClient.get('/') // ✅ Fetch again
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
          : 'https://via.placeholder.com/50?text=No+Logo', // ✅ Ensure valid logo
    }))
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to load jobs')
  }
}

// ✅ Manually Trigger Job Fetch (Only If Needed)
// In your API file
export const updateJobs = async (force = false) => {
  try {
    console.log('🔍 Checking last job update timestamp...')
    console.time('🔄 Total Job Update Time')

    // Skip the timestamp check if force is true
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

    console.log('✅ Jobs Updated:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error updating jobs:', error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to update jobs')
  }
}

// ✅ Fetch Job Details by ID (Fixed API Path)
export const getJobById = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('❌ Job ID is required to fetch job details')
    }

    console.log(`🔎 Fetching job details for ID: ${jobId}`)
    const response = await apiClient.get(`/job/${jobId}`) // ✅ Fixed API route

    console.log('✅ Job Details:', response.data)
    return response.data || {}
  } catch (error) {
    console.error(`❌ Error fetching job details (ID: ${jobId}):`, error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to fetch job details')
  }
}
