<script setup>
import { computed, onMounted, ref, watch, nextTick, onUnmounted } from 'vue'
import { useJobStore } from '@/stores/jobs'
import Navbar from '../../components/Navbar.vue'
import JobCard from './components/JobCard.vue'
import JobDetails from './components/JobDetails.vue'
import FilterPanel from './components/FilterPanel.vue'

const jobStore = useJobStore()
const jobList = ref(null)

/**
 * Fetch jobs when component is mounted.
 * Adds event listener for infinite scroll.
 */
onMounted(async () => {
  await jobStore.fetchJobs()
  nextTick(() => {
    if (jobList.value) {
      jobList.value.addEventListener('scroll', onScroll, { passive: true })
    }
  })
})

/**
 * Clean up event listener when component is unmounted.
 */
onUnmounted(() => {
  if (jobList.value) {
    jobList.value.removeEventListener('scroll', onScroll)
  }
})

/**
 * Computed property for getting a limited number of jobs from the store.
 */
const limitedJobs = computed(() => jobStore.getLimitedJobs)

/**
 * Watches for changes in filters and updates job list accordingly.
 */
watch(
  () => [
    jobStore.searchQuery,
    jobStore.selectedCategory,
    jobStore.selectedLocation,
    jobStore.selectedFilter,
  ],
  () => {
    console.log('🔄 Filter change detected in Dashboard.vue')

    jobStore.updateFilteredJobs(true)

    // Reset scroll position to top when filters change
    nextTick(() => {
      if (jobList.value) {
        jobList.value.scrollTop = 0
      }
    })
  },
  { deep: true },
)

/**
 * Handles infinite scrolling for loading more jobs when reaching the bottom.
 */
const onScroll = () => {
  if (!jobList.value) return

  const { scrollTop, scrollHeight, clientHeight } = jobList.value

  // If user scrolls near the bottom, load more jobs
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    console.log('🔄 Near bottom, loading more jobs...')
    jobStore.loadMoreJobs()
  }
}
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
          <div v-if="jobStore.loading" class="loading-more">Loading more jobs...</div>
          <div
            v-else-if="
              limitedJobs.length === jobStore.filteredJobs.length && limitedJobs.length > 0
            "
            class="no-more-jobs"
          >
            All jobs loaded
          </div>
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
  font-family: 'Source Sans Pro', sans-serif;
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

.loading-more,
.no-more-jobs {
  text-align: center;
  padding: 15px;
  color: #666;
  font-size: 14px;
}

.no-more-jobs {
  color: #999;
}
</style>
