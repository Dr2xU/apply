const axios = require('axios')
const RemoteJob = require('../models/RemoteJob')
const apiClient = require('../services/apiService')

const fetchAndSaveJobs = async (req, res) => {
  try {
    const response = await apiClient.get('/remote-jobs?limit=100')
    const jobs = response.data.jobs.map((job) => ({
      id: job.id,
      url: job.url,
      title: job.title,
      company_name: job.company_name,
      company_logo: job.company_logo,
      category: job.category,
      job_type: job.job_type,
      publication_date: new Date(job.publication_date),
      candidate_required_location: job.candidate_required_location,
      salary: job.salary,
      description: job.description,
    }))

    await RemoteJob.deleteMany({})
    await RemoteJob.insertMany(jobs)

    res.json({ message: 'Jobs fetched and saved', jobCount: jobs.length })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ error: 'Error fetching jobs' })
  }
}

const getSavedJobs = async (req, res) => {
  try {
    const jobs = await RemoteJob.find()
    res.json(jobs)
  } catch (error) {
    console.error('Error retrieving jobs:', error)
    res.status(500).json({ error: 'Error retrieving saved jobs' })
  }
}

module.exports = { fetchAndSaveJobs, getSavedJobs }
