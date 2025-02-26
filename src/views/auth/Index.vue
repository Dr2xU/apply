<template>
    <div class="auth-container">
      <n-card title="Authentication" style="width: 400px; margin: auto;">
        <component :is="currentComponent" />
        <n-button text @click="toggleForm">
          {{ isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In' }}
        </n-button>
      </n-card>
    </div>
</template>
  
<script>
  import { defineComponent, ref, computed } from 'vue';
  import LoginForm from './components/LoginForm.vue';
  import SignupForm from './components/SignupForm.vue';
  
  export default defineComponent({
    components: {
      LoginForm,
      SignupForm,
    },
    setup() {
      const isLogin = ref(true);
  
      const currentComponent = computed(() => (isLogin.value ? LoginForm : SignupForm));
  
      const toggleForm = () => {
        isLogin.value = !isLogin.value;
      };
  
      return {
        isLogin,
        currentComponent,
        toggleForm,
      };
    },
  });
  </script>
  
  <style scoped>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  </style>
  