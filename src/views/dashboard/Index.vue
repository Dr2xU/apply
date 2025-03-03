<template>
  <n-message-provider>
    <Navbar />
    <div class="dashboard-container">
      <!-- Search & Filters -->
      <FilterPanel @refresh-jobs="fetchJobs" />

      <!-- Job Listings & Details -->
      <div class="job-layout">
        <div class="job-list" ref="jobList" @scroll="onScroll">
          <JobCard
            v-for="job in visibleJobs"
            :key="job.id"
            :job="job"
            :isViewed="viewedJobs.has(job.id)"
            :isSelected="selectedJob && selectedJob.id === job.id"
            @select-job="selectJob"
          />
        </div>
        <JobDetails ref="jobDetails" :job="selectedJob" />
      </div>
    </div>
    <Footer />
  </n-message-provider>
</template>

<script>
import { defineComponent, ref, onMounted, nextTick } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import FilterPanel from './components/FilterPanel.vue'
import JobCard from './components/JobCard.vue'
import JobDetails from './components/JobDetails.vue'
import { getJobs, updateJobs } from '@/api/jobs'
import { markJobAsViewed, getViewedJobs } from '@/api/users' // ✅ Import API functions

export default defineComponent({
  components: { Navbar, Footer, FilterPanel, JobCard, JobDetails },
  setup() {
    const jobs = ref([])
    const visibleJobs = ref([])
    const selectedJob = ref(null)
    const viewedJobs = ref(new Set()) // ✅ Track viewed jobs using Set for efficiency
    const loadCount = ref(5)
    const jobList = ref(null)
    const jobDetails = ref(null) // ✅ Reference to JobDetails component

    // ✅ Fetch Jobs
    const fetchJobs = async () => {
      try {
        console.log('🔄 Fetching jobs...')
        let allJobs = await getJobs()

        // ✅ Sort jobs by `publication_date` (latest first)
        allJobs.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date))

        jobs.value = allJobs
        visibleJobs.value = jobs.value.slice(0, loadCount.value)

        // ✅ Fetch viewed jobs from backend
        let viewed = await getViewedJobs()
        viewedJobs.value = new Set(viewed) // ✅ Store as Set for fast lookup

        // ✅ Select first job and mark it as viewed (if not already marked)
        if (jobs.value.length > 0) {
          selectedJob.value = jobs.value[0]

          if (!viewedJobs.value.has(selectedJob.value.id)) {
            await markJobAsViewed(selectedJob.value.id)
            viewedJobs.value.add(selectedJob.value.id)
          }
        }

        console.log('✅ Jobs fetched and sorted:', jobs.value)
      } catch (err) {
        console.error('❌ Error fetching jobs:', err)
      }
    }

    // ✅ Refresh Jobs
    const refreshJobs = async () => {
      try {
        await updateJobs()
        await fetchJobs()
      } catch {
        console.error('Failed to refresh jobs')
      }
    }

    // ✅ Lazy Load More Jobs on Scroll
    const onScroll = () => {
      if (!jobList.value) return
      const { scrollTop, scrollHeight, clientHeight } = jobList.value

      // ✅ Check if scrolled to bottom
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadCount.value += 5
        visibleJobs.value = jobs.value.slice(0, loadCount.value)
      }
    }

    // ✅ Select Job and Mark as Viewed
    const selectJob = async (job) => {
      selectedJob.value = job

      // ✅ Avoid duplicate API calls
      if (!viewedJobs.value.has(job.id)) {
        try {
          await markJobAsViewed(job.id)
          viewedJobs.value.add(job.id) // ✅ Update state
        } catch (error) {
          console.error('❌ Error marking job as viewed:', error)
        }
      }

      // ✅ Scroll job details to top on selection
      nextTick(() => {
        if (jobDetails.value?.$el) {
          jobDetails.value.$el.scrollTop = 0
        }
      })
    }

    onMounted(fetchJobs)

    return {
      jobs,
      visibleJobs,
      selectedJob,
      viewedJobs,
      refreshJobs,
      selectJob,
      onScroll,
      jobList,
      jobDetails,
    }
  },
})
</script>

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
}

.job-details {
  width: 65%;
  padding: 20px;
  overflow-y: auto;
  height: 80vh;
}
</style>
