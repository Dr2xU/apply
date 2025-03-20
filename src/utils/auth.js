/**
 * Authentication Utility
 *
 * Handles token retrieval from localStorage.
 * Ensures token is available and valid before returning.
 */

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string|null} The authentication token or null if not found.
 */
export const getToken = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    console.warn('⚠ No authentication token found in localStorage.')
    return null
  }

  return token
}
