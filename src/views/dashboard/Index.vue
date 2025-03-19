<script setup>
import { computed, onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
import { useJobStore } from '@/stores/jobStore'
import Navbar from './components/Navbar.vue'
import JobCard from './components/JobCard.vue'
import JobDetails from './components/JobDetails.vue'
import FilterPanel from './components/FilterPanel.vue'

const jobStore = useJobStore()
const jobList = ref(null) // Reference for scroll detection

// ✅ Fetch jobs when component is mounted
onMounted(async () => {
  await jobStore.fetchJobs()
  nextTick(() => {
    if (jobList.value) {
      jobList.value.addEventListener('scroll', onScroll, { passive: true })
    }
  })
})

// ✅ Computed properties for dynamic updates
const filteredJobs = computed(() => jobStore.filteredJobs)
const limitedJobs = computed(() => jobStore.getLimitedJobs)

// ✅ Watch for filter changes & update job list
watch(
  () => [
    jobStore.searchQuery,
    jobStore.selectedCategory,
    jobStore.selectedLocation,
    jobStore.selectedFilter,
  ],
  ([newSearch, newCategory, newLocation, newFilter]) => {
    console.log('🔄 Filters Changed - Updating Job List...', {
      newSearch,
      newCategory,
      newLocation,
      newFilter,
    })
    jobStore.updateFilteredJobs(true) // ✅ Dynamically update job list

    nextTick(() => {
      if (jobList.value) {
        jobList.value.scrollTop = 0 // ✅ Reset scroll position
      }
    })
  },
  { deep: true },
)

// ✅ Handle Scroll Event for Lazy Loading
const onScroll = () => {
  if (!jobList.value) return
  const { scrollTop, scrollHeight, clientHeight } = jobList.value

  // If user reaches near the bottom, load more jobs
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    jobStore.loadMoreJobs()
  }
}

// ✅ Cleanup event listener on unmount
onUnmounted(() => {
  if (jobList.value) {
    jobList.value.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <n-message-provider>
    <Navbar />
    <div class="dashboard-container">
      <FilterPanel />

      <div class="job-layout">
        <div class="job-list" ref="jobList">
          <JobCard
            v-for="job in limitedJobs"
            :key="job.id"
            :job="job"
            :isSeen="jobStore.seenJobs.has(job.id)"
            :isApplied="jobStore.appliedJobs.has(job.id)"
            :isSaved="jobStore.savedJobs.has(job.id)"
            :isSelected="jobStore.selectedJob && jobStore.selectedJob.id === job.id"
            :loading="jobStore.loading"
            @select-job="jobStore.selectJob"
          />
        </div>
        <JobDetails
          v-if="jobStore.selectedJob"
          :job="jobStore.selectedJob"
          :isSaved="jobStore.savedJobs.has(jobStore.selectedJob.id)"
          :isApplied="jobStore.appliedJobs.has(jobStore.selectedJob.id)"
          :loading="jobStore.loading"
          @toggle-save="jobStore.toggleSave"
          @apply-job="jobStore.applyJob"
        />
      </div>
    </div>
  </n-message-provider>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.job-layout {
  display: flex;
  width: 100%;
  height: 80vh;
}

.job-list {
  width: 35%;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  height: 80vh;
  padding: 10px;
}
</style>
