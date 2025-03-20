<template>
  <div class="error-container" role="alert" aria-live="assertive">
    <n-card class="error-card">
      <h1 class="error-title" aria-label="Error 404: Page not found">404</h1>
      <p class="error-message">Oops! The page you are looking for does not exist.</p>
      <n-button type="primary" size="large" @click="goHome" aria-label="Go to the homepage">
        Go to Dashboard
      </n-button>
    </n-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * Redirects user to the homepage.
 */
const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  text-align: center;
  font-family: 'Source Sans Pro', sans-serif;
}

.error-card {
  max-width: 400px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: #0e4099;
}

.error-title {
  font-size: 80px;
  font-weight: bold;
  color: red;
  margin: 0;
}

.error-message {
  font-size: 18px;
  color: white;
  margin-bottom: 20px;
}

.n-button {
  width: 100%;
  font-size: 16px;
  padding: 12px;
}
</style>
