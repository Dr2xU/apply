<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useJobStore } from '@/stores/jobStore'
import { NInput, NSelect, NLayoutHeader, NButton, useMessage } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const jobStore = useJobStore()
const message = useMessage()

// Create local refs for the inputs - start with store values
const searchQueryLocal = ref(jobStore.searchQuery)
const selectedCategoryLocal = ref(jobStore.selectedCategory)
const selectedLocationLocal = ref(jobStore.selectedLocation)

// Direct methods to update filters following the FilterPanel pattern
const updateSearchQuery = (value) => {
  console.log('🔍 Search Query Updated:', value)
  searchQueryLocal.value = value
  jobStore.searchQuery = value // Directly set the store property
  jobStore.updateFilteredJobs(true) // Refresh job list immediately
}

const updateSelectedCategory = (value) => {
  console.log('📂 Category Filter Updated:', value)
  selectedCategoryLocal.value = value
  jobStore.selectedCategory = value // Directly set the store property
  jobStore.updateFilteredJobs(true) // Refresh job list immediately
}

const updateSelectedLocation = (value) => {
  console.log('📍 Location Filter Updated:', value)
  selectedLocationLocal.value = value
  jobStore.selectedLocation = value // Directly set the store property
  jobStore.updateFilteredJobs(true) // Refresh job list immediately
}

const handleForceUpdate = async () => {
  try {
    const result = await jobStore.forceUpdateJobs()

    if (result.success) {
      message.success('Jobs refreshed successfully!')
    } else {
      message.error(`Failed to refresh jobs: ${result.error}`)
    }
  } catch (error) {
    message.error('Error refreshing jobs')
    console.error('Error in refresh:', error)
  }
}

// Keep local refs synced with store values (in case they change elsewhere)
watch(
  () => jobStore.searchQuery,
  (newValue) => {
    searchQueryLocal.value = newValue
  },
)

watch(
  () => jobStore.selectedCategory,
  (newValue) => {
    selectedCategoryLocal.value = newValue
  },
)

watch(
  () => jobStore.selectedLocation,
  (newValue) => {
    selectedLocationLocal.value = newValue
  },
)

// ✅ Navigation functions - unchanged
const navigateTo = (route) => router.push({ name: route })
const handleLogout = () => {
  authStore.logout()
  localStorage.clear()
  router.push('/auth')
}
const handleLogoClick = () => router.push('/dashboard')

// ✅ Fix Scroll Blocking Warning - unchanged
onMounted(() => {
  document.addEventListener(
    'wheel',
    (event) => {
      if (event.target.closest('.n-select-menu, .n-scrollbar')) {
        event.stopPropagation()
      }
    },
    { passive: true },
  )
})
</script>

<template>
  <n-layout-header class="navbar">
    <div class="navbar-content">
      <div class="logo-container" @click="handleLogoClick">
        <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
        <span class="site-name">Apply</span>
      </div>

      <div class="filter-container">
        <n-input
          v-model:value="searchQueryLocal"
          placeholder="🔍 Search jobs..."
          clearable
          class="search-box"
          @update:value="updateSearchQuery"
        />

        <n-select
          v-model:value="selectedCategoryLocal"
          :options="jobStore.categoryOptions"
          placeholder="📂 Category"
          clearable
          class="filter-box"
          @update:value="updateSelectedCategory"
        />

        <n-select
          v-model:value="selectedLocationLocal"
          :options="jobStore.locationOptions"
          placeholder="📍 Location"
          clearable
          class="filter-box"
          @update:value="updateSelectedLocation"
        />

        <!-- Add this button to your navbar component -->
        <n-button
          type="primary"
          size="small"
          @click="handleForceUpdate"
          :loading="jobStore.loading"
          class="refresh-button"
        >
          <template #icon>
            <n-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </n-icon>
          </template>
        </n-button>
      </div>

      <div class="nav-icons">
        <img
          src="@/assets/avatar.svg"
          alt="Profile"
          class="nav-icon-img"
          @click="navigateTo('profile')"
        />
        <img
          src="@/assets/logout.svg"
          alt="Logout"
          class="nav-icon-img-logout"
          @click="handleLogout"
        />
      </div>
    </div>
  </n-layout-header>
</template>

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
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.logo-img {
  height: 40px;
}

.site-name {
  font-size: 18px;
  color: white;
  font-weight: bold;
  margin-left: 10px;
}

.filter-container {
  display: flex;
  gap: 10px;
  flex-grow: 1;
  max-width: 650px;
  align-items: center;
}

.search-box,
.filter-box {
  width: 100%;
}

.nav-icons {
  display: flex;
  gap: 10px;
}

.nav-icon-img {
  height: 30px;
  cursor: pointer;
}

.nav-icon-img-logout {
  margin-left: 20px;
  height: 30px;
  cursor: pointer;
}

.refresh-button {
  margin-left: 10px;
}

/* Optional: Add a nice hover effect */
.refresh-button:hover {
  background-color: red;
}
</style>
