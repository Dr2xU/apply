import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken') || '')

  function login(userData) {
    user.value = userData
    token.value = userData.token
    localStorage.setItem('authToken', userData.token)
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('authToken')
  }

  const isAuthenticated = computed(() => !!token.value)

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }
})
