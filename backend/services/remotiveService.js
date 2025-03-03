const axios = require('axios')
const { jobContainer } = require('../config/db')

const REMOTIVE_API_URL = 'https://remotive.com/api/remote-jobs'

// ✅ Fetch jobs from Remotive API with optional filters
const fetchRemoteJobs = async ({
  category = '',
  company_name = '',
  search = '',
  limit = 50,
} = {}) => {
  try {
    const params = new URLSearchParams({ category, company_name, search, limit }).toString()
    const response = await axios.get(`${REMOTIVE_API_URL}?${params}`)

    console.log(`✅ Successfully fetched ${response.data.jobs.length} jobs from Remotive.`)
    return response.data.jobs
  } catch (error) {
    console.error('❌ Error fetching jobs from Remotive:', error.message)
    throw new Error('Failed to fetch jobs from Remotive API')
  }
}

// ✅ Fetch jobs and store them in the database
const fetchAndSaveJobs = async () => {
  try {
    // Check last update timestamp
    const { resources } = await jobContainer.items
      .query('SELECT * FROM c ORDER BY c.timestamp DESC OFFSET 0 LIMIT 1')
      .fetchAll()

    const lastUpdated = resources.length ? new Date(resources[0].timestamp) : null
    const now = new Date()

    if (process.env.DISABLE_UPDATES === 'true') {
      console.log('🛑 Job updates disabled (DISABLE_UPDATES=true). Skipping fetch.')
      return
    }

    // Only update if 6+ hours have passed
    if (lastUpdated && now - lastUpdated < 6 * 60 * 60 * 1000) {
      console.log(`🛑 Skipping job update: Last updated at ${lastUpdated.toISOString()}.`)
      return
    }

    // Fetch jobs from Remotive API
    const jobs = await fetchRemoteJobs()
    if (!jobs.length) {
      console.warn('⚠ No new jobs retrieved from Remotive API.')
      return
    }

    // Save jobs to database
    const jobData = { id: Date.now().toString(), timestamp: now.toISOString(), jobs }
    await jobContainer.items.create(jobData)
    console.log(`✅ ${jobs.length} remote jobs saved to database at ${now.toISOString()}.`)
  } catch (error) {
    console.error('❌ Error saving jobs:', error)
  }
}

module.exports = { fetchRemoteJobs, fetchAndSaveJobs }
