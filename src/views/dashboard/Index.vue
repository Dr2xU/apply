<template>
  <div class="dashboard">
    <n-card title="Dashboard" style="max-width: 600px; margin: 50px auto;">
      <p>Welcome, {{ user.email }}!</p>
      <n-button type="error" @click="logout">Logout</n-button>
    </n-card>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    return {
      user: authStore.user,
      logout,
    };
  },
});
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 20px;
}
</style>
