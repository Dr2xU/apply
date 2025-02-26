import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('authToken') || '');

  function login(userData) {
    user.value = userData;
    token.value = userData.token;
    localStorage.setItem('authToken', userData.token);
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('authToken');
  }

  return {
    user,
    token,
    isAuthenticated: !!token.value,
    login,
    logout,
  };
});
