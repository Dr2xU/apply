<template>
  <n-message-provider>
    <div class="app-container" role="main" aria-label="Application container">
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
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
