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
      // Add scroll event listener
      jobList.value.addEventListener('scroll', onScroll, { passive: true })
    }
  })
})

// ✅ Clean up event listener when component is unmounted
onUnmounted(() => {
  if (jobList.value) {
    jobList.value.removeEventListener('scroll', onScroll)
  }
})

// ✅ Using getLimitedJobs from the store
const limitedJobs = computed(() => jobStore.getLimitedJobs)

// ✅ Watch for filter changes & update job list
watch(
  () => [
    jobStore.searchQuery,
    jobStore.selectedCategory,
    jobStore.selectedLocation,
    jobStore.selectedFilter,
  ],
  () => {
    console.log('🔄 Index.vue watch triggered for filter changes')

    // Force a manual update of the filtered jobs
    jobStore.updateFilteredJobs(true)

    // Reset scroll position
    nextTick(() => {
      if (jobList.value) {
        jobList.value.scrollTop = 0
      }
    })
  },
  { deep: true },
)

// ✅ Handle Scroll Event for Lazy Loading
const onScroll = () => {
  if (!jobList.value) return

  const { scrollTop, scrollHeight, clientHeight } = jobList.value

  // If we're near the bottom (within 100px), load more jobs
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
        <!-- This is where the jobs are displayed -->
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
          <!-- Add a loading indicator for when more jobs are being loaded -->
          <div v-if="jobStore.loading" class="loading-more">Loading more jobs...</div>
          <!-- Add a message when all jobs are loaded -->
          <div
            v-else-if="
              limitedJobs.length === jobStore.filteredJobs.length && limitedJobs.length > 0
            "
            class="no-more-jobs"
          >
            All jobs loaded
          </div>
        </div>

        <!-- Job details section -->
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

/* Add some styling for the loading indicators */
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
