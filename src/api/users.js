import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

// ✅ Get User Credentials
const getUserCredentials = () => {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  if (!userId) {
    console.warn('⚠ No user ID found in localStorage. User might not be logged in.')
    return { userId: null, token: null }
  }

  return { userId, token }
}

// ✅ Fetch ALL user job states (applied, saved, seen) in ONE request
export const getUserJobs = async () => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return {}

    console.log(`📡 Fetching user job states for userId=${userId}`)

    const response = await apiClient.get('/user-jobs', {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log('✅ API Response:', response.data) // 🔹 Add this for debugging

    if (!response.data) {
      console.warn('⚠ No user job data found in response!')
      return { seenJobs: [], savedJobs: [], appliedJobs: [] }
    }

    return response.data
  } catch (error) {
    console.error('❌ Error fetching user job data:', error)
    return { seenJobs: [], savedJobs: [], appliedJobs: [] }
  }
}

// ✅ Mark a job as seen (Avoids duplicate API calls)
export const markJobAsSeen = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    // Check if already seen in cache
    const seenJobs = JSON.parse(localStorage.getItem(`seenJobs_${userId}`)) || []
    if (seenJobs.includes(jobId)) {
      console.log(`⚠ Job ${jobId} already marked as seen, skipping API call`)
      return
    }

    console.log(`📌 Marking job as seen: userId=${userId}, jobId=${jobId}`)

    await apiClient.post(
      '/see-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // Update cache
    seenJobs.push(jobId)
    localStorage.setItem(`seenJobs_${userId}`, JSON.stringify(seenJobs))

    console.log(`✅ Job ${jobId} marked as seen.`)
  } catch (error) {
    console.error('❌ Error marking job as seen:', error)
  }
}

// ✅ Toggle job saved state (Avoid duplicate calls)
export const markJobAsSaved = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    // Check current state in cache
    let savedJobs = JSON.parse(localStorage.getItem(`savedJobs_${userId}`)) || []
    const isSaved = savedJobs.includes(jobId)

    console.log(`📌 Toggling job save state: ${isSaved ? 'Removing' : 'Saving'} job ${jobId}`)

    await apiClient.post(
      '/save-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // Update cache
    if (isSaved) {
      savedJobs = savedJobs.filter((id) => id !== jobId)
    } else {
      savedJobs.push(jobId)
    }
    localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(savedJobs))

    console.log(`✅ Job ${jobId} ${isSaved ? 'removed from' : 'added to'} saved jobs.`)
  } catch (error) {
    console.error('❌ Error toggling saved job:', error)
  }
}

// ✅ Mark job as applied (Avoid duplicate calls)
export const markJobAsApplied = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    // Check if already applied in cache
    let appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`)) || []
    if (appliedJobs.includes(jobId)) {
      console.log(`⚠ Job ${jobId} already marked as applied, skipping API call`)
      return
    }

    console.log(`📌 Marking job as applied: userId=${userId}, jobId=${jobId}`)

    await apiClient.post(
      '/apply-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // Update cache
    appliedJobs.push(jobId)
    localStorage.setItem(`appliedJobs_${userId}`, JSON.stringify(appliedJobs))

    console.log(`✅ Job ${jobId} marked as applied.`)
  } catch (error) {
    console.error('❌ Error marking job as applied:', error)
  }
}

// ✅ Delete a Saved Job (Avoid duplicate API calls)
export const deleteSavedJob = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    console.log(`📌 Removing saved job: userId=${userId}, jobId=${jobId}`)

    await apiClient.delete('/delete-saved-job', {
      data: { userId, jobId },
      headers: { Authorization: `Bearer ${token}` },
    })

    // Update cache
    let savedJobs = JSON.parse(localStorage.getItem(`savedJobs_${userId}`)) || []
    savedJobs = savedJobs.filter((id) => id !== jobId)
    localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(savedJobs))

    console.log(`✅ Job ${jobId} removed from saved jobs.`)
  } catch (error) {
    console.error('❌ Error deleting saved job:', error)
  }
}
