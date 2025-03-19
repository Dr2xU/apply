import axios from 'axios'

const API_URL = 'http://localhost:5000/api/auth'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

// ✅ Login User and Save Token & User ID
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post('/login', { email, password })

    if (response.data.token && response.data.userId) {
      localStorage.setItem('token', response.data.token) // ✅ Save token
      localStorage.setItem('userId', response.data.userId) // ✅ Save user ID
      console.log('✅ Token and userId saved:', response.data)
    } else {
      console.warn('⚠ No token or userId received from server.')
    }

    return response.data
  } catch (error) {
    console.error('❌ Error logging in:', error.message)
    throw new Error(error.response?.data?.error || 'Failed to log in')
  }
}

// ✅ User Registration
export const registerUser = async (email, password) => {
  try {
    const response = await apiClient.post('/register', { email, password })
    return response.data
  } catch (error) {
    console.error('❌ Registration Error:', error.response?.data || error.message)
    throw error.response?.data?.error || 'Registration failed.'
  }
}

// 🔹 Check Authentication Status
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

// 🔹 Logout User
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
