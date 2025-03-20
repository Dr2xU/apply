<template>
  <form class="auth-form" @submit.prevent="handleSignup" aria-labelledby="signup-heading">
    <h2 id="signup-heading" class="sr-only">Create an Account</h2>
    <div class="input-group">
      <label for="email" class="sr-only">Email</label>
      <input
        type="email"
        v-model="email"
        placeholder="Enter your email"
        autocomplete="email"
        required
        aria-required="true"
      />
    </div>
    <label for="confirmEmail" class="sr-only">Confirm Email</label>
    <div class="input-group">
      <input
        type="email"
        v-model="confirmEmail"
        placeholder="Confirm email"
        autocomplete="email"
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
        autocomplete="new-password"
        required
        aria-required="true"
        aria-describedby="passwordHelp"
      />
      <small id="passwordHelp" class="sr-only">Password must be at least 6 characters long.</small>
    </div>
    <div class="input-group">
      <label for="confirmPassword" class="sr-only">Confirm Password</label>
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm password"
        autocomplete="new-password"
        required
        aria-required="true"
      />
    </div>
    <div class="input-group">
      <button type="submit" class="btn" :disabled="loading" aria-label="Sign up">
        {{ loading ? 'Signing up...' : 'Sign Up' }}
      </button>
    </div>
    <p v-if="errorMessage" class="error-message" role="alert" aria-live="polite">
      {{ errorMessage }}
    </p>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

export default {
  emits: ['authenticated'],
  setup(_, { emit }) {
    const name = ref('')
    const email = ref('')
    const confirmEmail = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const errorMessage = ref('')
    const loading = ref(false)
    const router = useRouter()
    const authStore = useAuthStore()

    /**
     * Handles user signup process.
     * Ensures authentication state updates properly before redirecting.
     */
    const handleSignup = async () => {
      errorMessage.value = ''
      loading.value = true

      if (!email.value || !confirmEmail.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'Please fill in all fields.'
        loading.value = false
        return
      }

      if (password.value.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters long.'
        loading.value = false
        return
      }

      if (email.value !== confirmEmail.value) {
        errorMessage.value = "Emails don't match."
        loading.value = false
        return
      }

      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords don't match."
        loading.value = false
        return
      }

      try {
        const response = await registerUser(email.value, password.value)

        authStore.login(response)

        localStorage.setItem('token', response.token)
        localStorage.setItem('userId', response.userId)

        emit('authenticated')
      } catch (error) {
        errorMessage.value = 'Signup failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      confirmEmail,
      password,
      confirmPassword,
      handleSignup,
      errorMessage,
      loading,
    }
  },
}
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  background: #0e4099;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
  margin-left: 15px;
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
