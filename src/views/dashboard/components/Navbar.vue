<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useJobStore } from '@/stores/jobStore'
import { NInput, NSelect, NLayoutHeader } from 'naive-ui'

const router = useRouter()
const authStore = useAuthStore()
const jobStore = useJobStore()

// ✅ Computed refs ensure two-way binding with jobStore
const searchQuery = computed({
  get: () => jobStore.searchQuery,
  set: (value) => {
    console.log('🔍 Search Query Updated:', value)
    jobStore.updateFilters({
      searchQuery: value,
      selectedCategory: jobStore.selectedCategory,
      selectedLocation: jobStore.selectedLocation,
    })
  },
})

const selectedCategory = computed({
  get: () => jobStore.selectedCategory,
  set: (value) => {
    console.log('📂 Category Filter Updated:', value)
    jobStore.updateFilters({
      searchQuery: jobStore.searchQuery,
      selectedCategory: value,
      selectedLocation: jobStore.selectedLocation,
    })
  },
})

const selectedLocation = computed({
  get: () => jobStore.selectedLocation,
  set: (value) => {
    console.log('📍 Location Filter Updated:', value)
    jobStore.updateFilters({
      searchQuery: jobStore.searchQuery,
      selectedCategory: jobStore.selectedCategory,
      selectedLocation: value,
    })
  },
})

// ✅ Watcher to debug changes in store
watch(
  () => [jobStore.searchQuery, jobStore.selectedCategory, jobStore.selectedLocation],
  ([newSearch, newCategory, newLocation]) => {
    console.log('🟢 Store Filters Changed:', { newSearch, newCategory, newLocation })
  },
  { deep: true },
)

// ✅ Navigation
const navigateTo = (route) => router.push({ name: route })
const handleLogout = () => {
  authStore.logout()
  localStorage.clear()
  router.push('/auth')
}
const handleLogoClick = () => router.push('/dashboard')

// ✅ Fix Scroll Blocking Warning - Passive Event Listener
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
          v-model="searchQuery"
          placeholder="🔍 Search jobs..."
          clearable
          class="search-box"
        />

        <n-select
          v-model="selectedCategory"
          :options="jobStore.categoryOptions"
          placeholder="📂 Category"
          clearable
          class="filter-box"
        />

        <n-select
          v-model="selectedLocation"
          :options="jobStore.locationOptions"
          placeholder="📍 Location"
          clearable
          class="filter-box"
        />
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
</style>
