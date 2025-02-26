<template>
    <div class="error-container">
      <n-card title="404 - Page Not Found">
        <p>The page you are looking for does not exist.</p>
        <n-button type="primary" @click="goHome">Go to Home</n-button>
      </n-card>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
      const goHome = () => router.push('/');
  
      return { goHome };
    }
  };
  </script>
  
  <style scoped>
  .error-container {
    max-width: 400px;
    margin: auto;
    padding-top: 50px;
    text-align: center;
  }
  </style>
  