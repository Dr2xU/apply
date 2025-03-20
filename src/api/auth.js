/**
 * Authentication API Service
 *
 * Handles user authentication including login, registration,
 * authentication status check, and logout functionality.
 */

import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Logs in the user and saves the authentication token & user ID.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} The response data containing the authentication token.
 * @throws {Error} Throws an error if login fails.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password })

    if (response.data.token && response.data.userId) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId)
    } else {
      console.warn('⚠ No token or userId received from server.')
    }

    return response.data
  } catch (error) {
    console.error('❌ Error logging in:', error.message)
    throw new Error(error.response?.data?.error || 'Failed to log in')
  }
}

/**
 * Registers a new user in the system.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} The response data containing user details.
 * @throws {Error} Throws an error if registration fails.
 */
export const registerUser = async (email, password) => {
  try {
    const response = await apiClient.post('/register', { email, password })

    if (response.data.token && response.data.userId) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.userId)
    } else {
      console.warn('⚠ No token or userId received from server.')
    }

    return response.data
  } catch (error) {
    console.error('❌ Registration Error:', error.response?.data || error.message)
    throw new Error(error.response?.data?.error || 'Registration failed.')
  }
}

/**
 * Checks the user's authentication status by verifying the token.
 * @returns {Promise<boolean>} Returns true if authenticated, false otherwise.
 */
export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return false

    const response = await apiClient.get('/status', {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data.authenticated
  } catch (error) {
    return false
  }
}

/**
 * Logs out the user by removing authentication tokens and clearing session data.
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      await apiClient.post('/logout', {}, { headers: { Authorization: `Bearer ${token}` } })
    }
  } catch (error) {
    console.error('❌ Error during logout:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    sessionStorage.clear()
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}
