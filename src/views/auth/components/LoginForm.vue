<template>
  <n-card title="Login" style="max-width: 400px; margin: auto;">
    <n-form @submit.prevent="handleLogin">
      <InputForm v-model="email" label="Email" placeholder="Enter your email" />
      <InputForm v-model="password" label="Password" type="password" placeholder="Enter your password" />

      <n-button type="primary" @click="handleLogin" :disabled="!isFormValid">Login</n-button>
    </n-form>
  </n-card>
</template>

<script>
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { loginUser } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import InputForm from '@/components/InputForm.vue';

export default {
  components: { InputForm },
  setup() {
    const email = ref('');
    const password = ref('');
    const message = useMessage();
    const router = useRouter();
    const authStore = useAuthStore();
    const errorMessage = ref('');

    const isFormValid = computed(() => {
      return email.value.trim() !== '' && password.value !== '';
    });

    const handleLogin = async () => {
      errorMessage.value = '';

      try {
        const response = await loginUser(email.value, password.value);
        localStorage.setItem('authToken', response.token);
        authStore.login({ email: response.email });

        message.success("Login successful!");
        router.push('/dashboard');

      } catch (error) {
        errorMessage.value = error || "Invalid credentials";
      }
    };

    return { email, password, handleLogin, errorMessage, isFormValid };
  },
};
</script>
