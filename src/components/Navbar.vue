<template>
  <n-layout-header class="navbar">
    <div class="navbar-content">
      <!-- ✅ Logo -->
      <div class="logo" @click="handleLogoClick">
        <img src="@/assets/logo.png" alt="LinkedIn Logo" class="logo-img" />
      </div>

      <!-- ✅ Search & Location Inputs -->
      <div class="search-container">
        <n-input
          v-model="searchQuery"
          placeholder="🔍 Title, skill or company"
          clearable
          class="search-box"
          @input="handleSearch"
        />
        <n-select
          v-model="selectedLocation"
          :options="locationOptions"
          placeholder="📍 Location"
          clearable
          class="location-box"
          @update:value="handleLocationChange"
        />
      </div>

      <!-- ✅ Navigation Icons -->
      <div class="nav-icons">
        <img :src="briefcaseIcon" alt="Jobs" class="nav-icon-img" @click="navigateTo('jobs')" />
        <img :src="resumeIcon" alt="Resume" class="nav-icon-img" @click="navigateTo('resume')" />
        <img :src="profileIcon" alt="Profile" class="nav-icon-img" @click="navigateTo('profile')" />
        <img :src="logoutIcon" alt="Logout" class="nav-icon-img-logout" @click="handleLogout" />
      </div>
    </div>
  </n-layout-header>
</template>

<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { NInput, NSelect } from 'naive-ui'

export default defineComponent({
  components: { NInput, NSelect },
  setup() {
    const API_URL = 'http://localhost:5000/api/users' // Ensure this matches your backend
    const searchQuery = ref('')
    const selectedLocation = ref(null)
    const locationOptions = ref([
      { label: 'Europe', value: 'Europe' },
      { label: 'USA', value: 'USA' },
    ])
    const briefcaseIcon = new URL('@/assets/briefcase.svg', import.meta.url).href
    const resumeIcon = new URL('@/assets/resume.svg', import.meta.url).href
    const profileIcon = new URL('@/assets/avatar.svg', import.meta.url).href
    const logoutIcon = new URL('@/assets/logout.svg', import.meta.url).href

    const handleSearch = () => {
      console.log('Searching for:', searchQuery.value)
    }

    const handleLocationChange = () => {
      console.log('Location selected:', selectedLocation.value)
    }

    const navigateTo = (route) => {
      router.push({ name: route })
    }

    const handleLogout = async () => {
      console.log('Logging out...')

      const router = useRouter()
      const authStore = useAuthStore()
      const token = localStorage.getItem('token') // ✅ Get token

      try {
        if (token) {
          await axios.post(
            `${API_URL}/logout`, // ✅ Call API to handle logout
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          )
          console.log('✅ Logout request sent to server.')
        } else {
          console.warn('⚠ No token found. Skipping API logout request.')
        }
      } catch (error) {
        console.error('❌ Error during logout request:', error)
      }

      // ✅ Clear authentication state in Pinia
      authStore.logout()

      // ✅ Remove authentication tokens from storage
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userId')
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

      // ✅ Redirect user to the login page
      router.push('/auth')
    }

    return {
      searchQuery,
      selectedLocation,
      locationOptions,
      resumeIcon,
      profileIcon,
      briefcaseIcon,
      logoutIcon,
      handleSearch,
      handleLocationChange,
      navigateTo,
      handleLogout,
    }
  },
})
</script>

<style scoped>
.navbar {
  background-color: #0e4099;
  padding: 10px 20px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-img {
  height: 40px;
  cursor: pointer;
  margin-left: 25px;
}

.search-container {
  display: flex;
  gap: 10px;
  flex-grow: 1;
  max-width: 500px;
}

.search-box,
.location-box {
  width: 100%;
}

.nav-icons {
  display: flex;
  gap: 10px;
}

.nav-icon-img {
  font-size: 5px;
  height: 30px;
  padding: 5px;
  cursor: pointer;
}

.nav-icon-img-logout {
  margin-left: 20px;
  height: 30px;
  padding: 5px;
  cursor: pointer;
  margin-right: 25px;
}

.notification {
  position: relative;
}

.profile-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
</style>
