/**
 * Users API Service
 *
 * Manages user job interactions, including fetching job states,
 * marking jobs as seen, saving jobs, applying for jobs, and deleting saved jobs.
 */

import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Retrieves user credentials (userId and token) from localStorage.
 * @returns {Object} { userId, token }
 */
const getUserCredentials = () => {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')

  if (!userId) {
    console.warn('⚠ No user ID found in localStorage. User might not be logged in.')
    return { userId: null, token: null }
  }

  return { userId, token }
}

/**
 * Fetches all user job states (seen, saved, applied) in one request.
 * @returns {Promise<Object>} Object containing seenJobs, savedJobs, and appliedJobs arrays.
 */
export const getUserJobs = async () => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return {}

    console.log(`📡 Fetching user job states for userId=${userId}`)

    const response = await apiClient.get('/user-jobs', {
      params: { userId },
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data || { seenJobs: [], savedJobs: [], appliedJobs: [] }
  } catch (error) {
    console.error('❌ Error fetching user job data:', error)
    return { seenJobs: [], savedJobs: [], appliedJobs: [] }
  }
}

/**
 * Marks a job as seen by the user.
 * Uses caching to avoid duplicate API calls.
 * @param {string} jobId - The ID of the job to mark as seen.
 */
export const markJobAsSeen = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    // Check if already seen in cache
    const seenJobs = JSON.parse(localStorage.getItem(`seenJobs_${userId}`)) || []
    if (seenJobs.includes(jobId)) return

    console.log(`📌 Marking job as seen: userId=${userId}, jobId=${jobId}`)

    await apiClient.post(
      '/see-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // Update cache
    seenJobs.push(jobId)
    localStorage.setItem(`seenJobs_${userId}`, JSON.stringify(seenJobs))
  } catch (error) {
    console.error('❌ Error marking job as seen:', error)
  }
}

/**
 * Toggles a job's saved state (save/unsave).
 * Uses caching to avoid redundant API calls.
 * @param {string} jobId - The ID of the job to save/unsave.
 */
export const markJobAsSaved = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    let savedJobs = JSON.parse(localStorage.getItem(`savedJobs_${userId}`)) || []
    const isSaved = savedJobs.includes(jobId)

    console.log(`📌 Toggling job save state: ${isSaved ? 'Removing' : 'Saving'} job ${jobId}`)

    await apiClient.post(
      '/save-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // Update cache
    savedJobs = isSaved ? savedJobs.filter((id) => id !== jobId) : [...savedJobs, jobId]
    localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(savedJobs))
  } catch (error) {
    console.error('❌ Error toggling saved job:', error)
  }
}

/**
 * Marks a job as applied by the user.
 * Uses caching to avoid duplicate API calls.
 * @param {string} jobId - The ID of the job to mark as applied.
 */
export const markJobAsApplied = async (jobId) => {
  try {
    const { userId, token } = getUserCredentials()
    if (!userId) return

    let appliedJobs = JSON.parse(localStorage.getItem(`appliedJobs_${userId}`)) || []
    if (appliedJobs.includes(jobId)) return

    console.log(`📌 Marking job as applied: userId=${userId}, jobId=${jobId}`)

    await apiClient.post(
      '/apply-job',
      { userId, jobId },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    // Update cache
    appliedJobs.push(jobId)
    localStorage.setItem(`appliedJobs_${userId}`, JSON.stringify(appliedJobs))
  } catch (error) {
    console.error('❌ Error marking job as applied:', error)
  }
}

/**
 * Deletes a saved job from the user's saved jobs list.
 * Uses caching to avoid redundant API calls.
 * @param {string} jobId - The ID of the job to remove from saved jobs.
 */
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
  } catch (error) {
    console.error('❌ Error deleting saved job:', error)
  }
}
