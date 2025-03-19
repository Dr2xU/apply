const axios = require('axios')
const { setupDatabase } = require('../config/db')

const REMOTIVE_API_URL = 'https://remotive.io/api/remote-jobs'

const fetchRemoteJobs = async () => {
  try {
    console.log('🔄 Fetching jobs from Remotive API...')
    console.time('🔄 API Response Time') // Measure API response time

    const response = await axios.get(REMOTIVE_API_URL, { timeout: 20000 })

    console.timeEnd('🔄 API Response Time') // Log API response time
    console.log(`✅ Successfully fetched ${response.data.jobs.length} jobs from Remotive.`)

    return response.data.jobs
  } catch (error) {
    console.error('❌ Error fetching jobs from Remotive:', error.message)
    throw new Error('Failed to fetch jobs from Remotive API')
  }
}

const fetchAndSaveJobs = async () => {
  try {
    console.log('🔄 Checking last job update timestamp...')
    const { jobs } = await setupDatabase()
    if (!jobs) throw new Error('❌ Jobs container is not initialized.')

    console.log('🔄 Fetching jobs from Remotive API...')
    const jobsList = await fetchRemoteJobs()
    if (!jobsList.length) {
      console.warn('⚠ No new jobs retrieved from Remotive API.')
      return
    }

    console.log(`📦 Saving ${jobsList.length} jobs into the database.`)
    for (const job of jobsList) {
      job.id = job.id.toString() // Ensure ID is a string
      await jobs.items.upsert(job)
    }

    // ✅ Ensure timestamp entry exists
    console.log('🕒 Updating last job update timestamp...')
    await jobs.items.upsert({
      id: 'last_update_timestamp',
      timestamp: new Date().toISOString(),
    })

    console.log(`✅ ${jobsList.length} jobs saved to the database.`)
  } catch (error) {
    console.error('❌ Error during job update:', error.message)
  }
}

module.exports = { fetchRemoteJobs, fetchAndSaveJobs }
