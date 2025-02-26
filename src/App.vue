<template>
  <n-message-provider>
    <Navbar/>
    <div class="app-container">
      <router-view class="centered-view" />
    </div>
    <Footer/>
  </n-message-provider>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue';

export default {
  components: { Navbar, Footer },
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.centered-view {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.footer {
  margin-top: auto;
}
</style>
