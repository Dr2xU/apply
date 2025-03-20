<template>
  <div class="auth-container">
    <div class="auth-box">
      <div class="form-container sign-in-container">
        <h2>Welcome Back!</h2>
        <LoginForm @authenticated="handleAuthSuccess" aria-labelledby="login-section" />
      </div>

      <div class="form-container sign-up-container">
        <h2>Welcome to Apply!</h2>
        <SignupForm @authenticated="handleAuthSuccess" aria-labelledby="signup-section" />
      </div>

      <div class="overlay-container" :class="{ 'move-left': !isLogin }" role="complementary">
        <div class="overlay">
          <div class="overlay-panel">
            <h1>Apply to Jobs with Apply</h1>
            <h2>
              {{ isLogin ? 'Ready to Elevate Your Career?' : 'Already Have an Account?' }}
            </h2>
            <p>
              {{
                isLogin
                  ? 'Unlock exclusive job opportunities, save your favorites, and track applications effortlessly. Sign up today!'
                  : 'Great to see you again! Let’s continue your journey towards the perfect job.'
              }}
            </p>
            <button class="ghost" @click="toggleForm">
              {{ isLogin ? 'Create an Account' : 'Log In Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from './components/LoginForm.vue'
import SignupForm from './components/SignupForm.vue'

export default {
  components: { LoginForm, SignupForm },
  setup() {
    const isLogin = ref(true)
    const router = useRouter()

    /**
     * Toggles between Sign-In and Sign-Up forms.
     */
    const toggleForm = () => {
      isLogin.value = !isLogin.value
    }

    /**
     * Handles successful authentication (login or signup).
     * Redirects user to the dashboard.
     */
    const handleAuthSuccess = () => {
      router.push('/dashboard')
    }

    return { isLogin, toggleForm, handleAuthSuccess }
  },
}
</script>

<style scoped>
.auth-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  overflow: hidden;
  font-family: 'Source Sans Pro', sans-serif;
}

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

.sign-in-container {
  position: absolute;
  left: 0;
}

.sign-up-container {
  position: absolute;
  right: 0;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 45%;
  height: 60%;
  transition: transform 0.6s ease-in-out;
  background: #0e4099;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  z-index: 3;
  border-radius: 50px;
  margin-top: 180px;
  padding-left: 40px;
}

.move-left {
  transform: translateX(-100%);
  background: #18a058;
  padding-left: 35px;
}

.overlay-panel {
  width: 80%;
  margin-left: 10px;
}

.ghost {
  background: transparent;
  border: 2px solid #fff;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 50px;
}

h1 {
  font-size: 30px;
  margin-bottom: 70px;
}
</style>
