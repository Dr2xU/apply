/**
 * Authentication Store (Pinia)
 *
 * Manages user authentication state, including login, logout,
 * and session persistence via localStorage.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Reactive state for user and authentication token
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken') || '')

  /**
   * Logs in the user by setting user data and token.
   * Saves authentication token to localStorage for persistence.
   * @param {Object} userData - User object containing authentication token.
   */
  function login(userData) {
    user.value = userData
    token.value = userData.token
    localStorage.setItem('authToken', userData.token)
  }

  /**
   * Logs out the user by clearing session data.
   * Removes authentication token from localStorage.
   */
  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('authToken')
  }

  /**
   * Computes the authentication status.
   * @returns {boolean} True if user is authenticated, otherwise false.
   */
  const isAuthenticated = computed(() => !!token.value)

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }
})
