<template>
  <n-card title="Sign Up" style="max-width: 400px; margin: auto;">
    <n-form @submit.prevent="handleSignup">
      <InputForm v-model="email" label="Email" placeholder="Enter your email" />
      <InputForm v-model="password" label="Password" type="password" placeholder="Enter your password" />
      <InputForm v-model="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" />

      <n-button type="primary" @click="handleSignup" :disabled="!isFormValid">Sign Up</n-button>
    </n-form>
  </n-card>
</template>

<script>
import { ref, computed } from 'vue';
import { useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';
import { registerUser, loginUser } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';
import InputForm from '@/components/InputForm.vue';

export default {
  components: { InputForm },
  setup() {
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const message = useMessage(); // ✅ Naive UI message
    const router = useRouter();
    const authStore = useAuthStore();

    const isFormValid = computed(() => {
      return email.value.trim() !== '' && password.value !== '' && confirmPassword.value !== '';
    });

    const handleSignup = async () => {
      if (password.value !== confirmPassword.value) {
        message.error("Passwords do not match!"); // ✅ Error at the top
        return;
      }

      try {
        await registerUser(email.value, password.value);
        message.success("Signup successful! Logging you in...");

        const loginResponse = await loginUser(email.value, password.value);
        localStorage.setItem('authToken', loginResponse.token);
        authStore.login({ email: loginResponse.email });

        router.push('/dashboard');

      } catch (error) {
        if (error.includes("already exists")) {
          message.error("User already exists. Please log in."); // ✅ Same error style
        } else {
          message.error(error || "Registration failed");
        }
      }
    };

    return { email, password, confirmPassword, handleSignup, isFormValid };
  },
};
</script>
