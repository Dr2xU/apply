import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

// ✅ Mark a job as viewed
export const markJobAsViewed = async (jobId) => {
  try {
    const userId = localStorage.getItem('userId') // ✅ Get user ID
    const token = localStorage.getItem('token') // ✅ Get token

    if (!userId) {
      console.warn('⚠ No user ID found in localStorage. User might not be logged in.')
      return
    }

    console.log(`📌 Marking job as viewed: userId=${userId}, jobId=${jobId}`)

    const response = await apiClient.post(
      '/view-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    console.log(`✅ Job ${jobId} marked as viewed.`)
    return response.data
  } catch (error) {
    console.error('❌ Error marking job as viewed:', error)
    throw new Error('Failed to mark job as viewed')
  }
}

// ✅ Fetch all jobs that have been viewed
export const getViewedJobs = async () => {
  try {
    const userId = localStorage.getItem('userId') // ✅ Get user ID
    const token = localStorage.getItem('token') // ✅ Get token

    if (!userId) {
      console.warn('⚠ No user ID found in localStorage. User might not be logged in.')
      return []
    }

    console.log(`📌 Fetching viewed jobs for userId=${userId}`)

    const response = await apiClient.get('/viewed-jobs', {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('✅ Viewed Jobs:', response.data)
    return response.data || []
  } catch (error) {
    console.error('❌ Error fetching viewed jobs:', error)
    return []
  }
}
