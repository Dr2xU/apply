/**
 * Remotive Jobs Controller
 *
 * This module fetches remote job listings from the Remotive API
 * and stores them in the database.
 */

const axios = require('axios')

const REMOTIVE_API_URL = 'https://remotive.com/api/remote-jobs'

/**
 * Fetches remote jobs from the Remotive API and saves them in the database.
 * @param {Object} jobsContainer - The CosmosDB container for storing jobs.
 * @returns {Promise<Object>} A message indicating the number of jobs updated or an error message.
 */
const fetchAndSaveJobs = async (jobsContainer) => {
  try {
    console.log('🔄 Fetching jobs from Remotive API...')
    const response = await axios.get(REMOTIVE_API_URL, { timeout: 15000 })

    if (!response.data || !Array.isArray(response.data.jobs)) {
      console.error('❌ Invalid API response format:', response.data)
      return { error: 'Invalid response from Remotive API' }
    }

    console.log(`✅ Successfully fetched ${response.data.jobs.length} jobs from Remotive.`)

    // Transform API job data for database storage
    const jobs = response.data.jobs.map((job) => ({
      id: job.id.toString(),
      url: job.url,
      title: job.title,
      company_name: job.company_name,
      company_logo: job.company_logo?.startsWith('http')
        ? job.company_logo
        : 'https://dummyimage.com/50x50/cccccc/000000.png&text=No+Logo',
      category: job.category,
      tags: job.tags,
      job_type: job.job_type,
      publication_date: new Date(job.publication_date).toISOString(),
      candidate_required_location: job.candidate_required_location || 'Worldwide',
      salary: job.salary || 'Not specified',
      description: job.description || 'No description available',
    }))

    console.log(`📦 Storing ${jobs.length} jobs into the database...`)

    // Save jobs to database
    await Promise.all(jobs.map((job) => jobsContainer.items.upsert(job)))

    console.log('✅ Jobs saved successfully.')
    return { message: 'Jobs updated successfully', jobCount: jobs.length }
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message)
    console.error('Full error:', error)
    return { error: error.message || 'Error fetching jobs' }
  }
}

module.exports = { fetchAndSaveJobs }
