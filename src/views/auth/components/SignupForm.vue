<template>
  <form class="auth-form" @submit.prevent="handleSignup">
    <div class="input-group">
      <input type="text" v-model="name" placeholder="Enter your name" required />
    </div>
    <div class="input-group">
      <input type="email" v-model="email" placeholder="Enter your email" required />
    </div>
    <div class="input-group">
      <input type="password" v-model="password" placeholder="Enter your password" required />
    </div>
    <div class="input-group">
      <input type="password" v-model="confirmPassword" placeholder="Confirm password" required />
    </div>
    <button type="submit" class="btn">Sign Up</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/auth'

export default {
  setup() {
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const errorMessage = ref('')
    const router = useRouter()

    const handleSignup = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords don't match"
        return
      }
      try {
        await registerUser(name.value, email.value, password.value)
        router.push('/dashboard')
      } catch (error) {
        errorMessage.value = 'Signup failed. Try again.'
      }
    }

    return { name, email, password, confirmPassword, handleSignup, errorMessage }
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
  background: #0074e4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  background: #005bb5;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
