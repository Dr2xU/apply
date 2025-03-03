const axios = require('axios')

const REMOTIVE_API_URL = 'https://remotive.io/api/remote-jobs'

const fetchAndSaveJobs = async (req, res, jobsContainer) => {
  try {
    console.log('🔄 Fetching jobs from Remotive API...')

    const response = await axios.get(REMOTIVE_API_URL, { timeout: 15000 })

    if (!response.data || !Array.isArray(response.data.jobs)) {
      console.error('❌ Invalid API response format:', response.data)
      return res.status(500).json({ error: 'Invalid response from Remotive API' })
    }

    console.log(`✅ Successfully fetched ${response.data.jobs.length} jobs from Remotive.`)

    const jobs = response.data.jobs.map((job) => ({
      id: job.id.toString(),
      url: job.url,
      title: job.title,
      company_name: job.company_name,
      company_logo:
        job.company_logo && job.company_logo.startsWith('http')
          ? job.company_logo
          : 'https://via.placeholder.com/50?text=No+Logo', // ✅ Ensure valid logo
      category: job.category,
      job_type: job.job_type,
      publication_date: new Date(job.publication_date).toISOString(),
      candidate_required_location: job.candidate_required_location || 'Worldwide',
      salary: job.salary || 'Not specified',
      description: job.description || 'No description available',
    }))

    console.log(`📦 Saving ${jobs.length} jobs into the database.`)

    await jobsContainer.items.create(jobs)

    console.log('✅ Jobs saved successfully.')
    res.json({ message: 'Jobs updated successfully', jobCount: jobs.length })
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message)
    res.status(500).json({ error: error.message || 'Error fetching jobs' })
  }
}

module.exports = { fetchAndSaveJobs }
