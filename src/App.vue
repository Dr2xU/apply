<template>
  <n-message-provider>
    <div class="app-container">
      <router-view />
    </div>
  </n-message-provider>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
/* ✅ Make sure the app takes the full screen */
.app-container {
  width: 100vw; /* Full width */
  height: 100vh; /* Full height */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Prevent scrolling */
}
</style>
