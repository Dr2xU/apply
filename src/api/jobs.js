import axios from 'axios'

// ✅ API Base URL
const API_URL = 'http://localhost:5000/api/jobs'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

// ✅ Fetch Jobs from Backend
export const getJobs = async () => {
  try {
    const response = await apiClient.get('/')
    console.log('🔹 API Response:', response.data)

    if (Array.isArray(response.data) && response.data.length > 0) {
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
    } else {
      console.warn('⚠ No jobs found in API response.')
      return []
    }
  } catch (error) {
    console.error('❌ Error fetching jobs:', error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to load jobs')
  }
}

// ✅ Manually Trigger Job Fetch from API
export const updateJobs = async () => {
  try {
    console.log('🔄 Requesting job update...')
    const response = await apiClient.get('/update')
    console.log('✅ Jobs Updated:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error updating jobs:', error.message || error)
    throw new Error(error.response?.data?.error || 'Failed to update jobs')
  }
}
