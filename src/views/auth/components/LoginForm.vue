<template>
  <form class="auth-form" @submit.prevent="handleLogin">
    <div class="input-group">
      <input type="email" v-model="email" placeholder="Enter your email" required />
    </div>
    <div class="input-group">
      <input type="password" v-model="password" placeholder="Enter your password" required />
    </div>
    <button type="submit" class="btn">Login</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogin = async () => {
      errorMessage.value = ''
      try {
        const response = await loginUser(email.value, password.value)
        authStore.login(response)
        router.push('/dashboard')
      } catch (error) {
        errorMessage.value = 'Invalid credentials. Try again.'
      }
    }

    return { email, password, handleLogin, errorMessage }
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
  background: #008060;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #005a40;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
