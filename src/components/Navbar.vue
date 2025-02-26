<template>
  <n-layout-header class="navbar">
     <n-space justify="space-between" align="center" class="navbar-content">
       
       <!-- ✅ Logo and App Name (Redirects to Auth or Dashboard) -->
       <div class="logo" @click="handleLogoClick">
         <img src="@/assets/logo.png" alt="App Logo" class="logo-img" />
         <span class="app-name">Apply</span>
       </div>
 
       <!-- ✅ Navigation Links (Hidden when not logged in) -->
       <n-space v-if="authStore.isLoggedIn" class="nav-links">
         <n-button text @click="goHome">Home</n-button>
         <n-button text @click="goJobs">Jobs</n-button>
       </n-space>
 
     </n-space>
   </n-layout-header>
 </template>
 
 <script>
 import { defineComponent, computed } from 'vue';
 import { useRouter } from 'vue-router';
 import { useAuthStore } from '@/stores/auth';
 
 export default defineComponent({
   setup() {
     const router = useRouter();
     const authStore = useAuthStore();
 
     // ✅ Redirect based on authentication state when clicking the logo
     const handleLogoClick = () => {
       if (authStore.isLoggedIn) {
         router.push('/dashboard'); // ✅ Redirect to dashboard if logged in
       } else {
         router.push('/auth'); // ✅ Redirect to login if logged out
       }
     };
 
     const goHome = () => router.push('/');
     const goJobs = () => router.push('/jobs');
 
     return { authStore, handleLogoClick, goHome, goJobs };
   }
 });
 </script>
 
 <style scoped>
 /* ✅ Ensure Navbar Background is Fully Blue */
 .navbar {
   background-color: #0c3f99 !important;
   padding: 10px 20px;
   width: 100vw;
   display: flex;
   align-items: center;
   justify-content: space-between;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 }
 
 /* ✅ Center Nav-Links & Ensure They Are White */
 .nav-links {
   display: flex;
   gap: 15px;
   flex-grow: 1;
   justify-content: center;
 }
 
 /* ✅ Ensure All Navbar Buttons Are White */
 .nav-links .n-button {
   color: #ffffff !important;
   background-color: transparent !important;
   border: none !important;
 }
 
 /* ✅ Logo Styles */
 .logo {
   display: flex;
   align-items: center;
   cursor: pointer;
 }
 
 .logo-img {
   height: 30px;
   margin-right: 10px;
 }
 
 .app-name {
   font-size: 18px;
   font-weight: bold;
   color: #ffffff !important; /* ✅ White Text */
 }
 </style>
 