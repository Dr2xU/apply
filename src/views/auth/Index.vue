<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- Sign In Form (Fixed Left) -->
      <div class="form-container sign-in-container">
        <h2>Sign In</h2>
        <LoginForm />
      </div>

      <!-- Sign Up Form (Fixed Right) -->
      <div class="form-container sign-up-container">
        <h2>Sign Up</h2>
        <SignupForm />
      </div>

      <!-- Moving Overlay Section -->
      <div class="overlay-container" :class="{ 'move-left': !isLogin }">
        <div class="overlay">
          <div class="overlay-panel">
            <h2>{{ isLogin ? 'Join Us!' : 'Welcome Back!' }}</h2>
            <p>
              {{
                isLogin
                  ? 'Create an account to access exclusive features.'
                  : 'We are so happy to have you here again!'
              }}
            </p>
            <button class="ghost" @click="toggleForm">
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import SignupForm from './components/SignupForm.vue'

export default {
  components: { LoginForm, SignupForm },
  setup() {
    const isLogin = ref(true)

    const toggleForm = () => {
      isLogin.value = !isLogin.value
    }

    return { isLogin, toggleForm }
  },
}
</script>

<style scoped>
/* ✅ Full-Screen Container */
.auth-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  overflow: hidden;
}

/* ✅ Authentication Box */
.auth-box {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 10px;
  display: flex;
}

/* ✅ Form Containers */
.form-container {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: white;
  transition: opacity 0.6s ease-in-out;
}

/* ✅ Fix Sign-In & Sign-Up Positions */
.sign-in-container {
  position: absolute;
  left: 0;
}

.sign-up-container {
  position: absolute;
  right: 0;
}

/* ✅ Moving Overlay */
.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  transition: transform 0.6s ease-in-out;
  background: linear-gradient(135deg, #00a884, #0074e4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  z-index: 3;
}

/* ✅ Moves the Overlay Left */
.move-left {
  transform: translateX(-100%);
}

/* ✅ Overlay Panel */
.overlay-panel {
  width: 80%;
  padding: 50px;
}

.ghost {
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
}
</style>
