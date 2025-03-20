<template>
  <form class="auth-form" @submit.prevent="handleLogin" aria-labelledby="login-heading">
    <h2 id="login-heading" class="sr-only">Login to Apply</h2>
    <div class="input-group">
      <label for="email" class="sr-only">Email</label>
      <input
        type="email"
        v-model="email"
        placeholder="Enter your email"
        autocomplete
        required
        aria-required="true"
      />
    </div>
    <div class="input-group">
      <label for="password" class="sr-only">Password</label>
      <input
        type="password"
        v-model="password"
        placeholder="Enter your password"
        autocomplete
        required
        aria-required="true"
      />
    </div>
    <button type="submit" class="btn" :disabled="loading" aria-label="Log in">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
    <p v-if="errorMessage" class="error-message" role="alert" aria-live="polite">
      {{ errorMessage }}
    </p>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const loading = ref(false)
    const authStore = useAuthStore()
    const router = useRouter()

    /**
     * Handles user login process.
     * Validates input fields, authenticates user, and navigates to dashboard.
     */
    const handleLogin = async () => {
      errorMessage.value = ''
      loading.value = true

      if (!email.value || !password.value) {
        errorMessage.value = 'Please fill in all fields.'
        loading.value = false
        return
      }

      try {
        const response = await loginUser(email.value, password.value)
        authStore.login(response)
        router.push('/dashboard')
      } catch (error) {
        errorMessage.value = 'Invalid email or password. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return { email, password, handleLogin, errorMessage, loading }
  },
}
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.input-group {
  width: 100%;
  max-width: 280px;
  margin-bottom: 15px;
  margin-top: 10px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background: #f8f9fa;
  transition: 0.3s;
}

input:focus {
  border-color: #0074e4;
  background: #fff;
}

.btn {
  width: 100%;
  max-width: 280px;
  padding: 12px;
  background: #18a058;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
  margin-left: 20px;
}

.btn:hover {
  background: #005a40;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
