<template>
  <!-- Job details container -->
  <div v-if="job" class="job-details-container">
    <div class="job-header">
      <!-- Company Information: Logo and Name -->
      <div class="company-info">
        <n-avatar
          :src="computedLogo"
          size="large"
          class="company-logo"
          :alt="`Company logo of ${job.company_name}`"
        />
        <div>
          <h3 class="company-name">{{ job.company_name }}</h3>
          <p class="job-location">{{ job.candidate_required_location }}</p>
        </div>
      </div>

      <!-- Job Title & Metadata -->
      <h2 class="job-title">{{ job.title }}</h2>
      <p class="job-meta">
        <span>{{ repostedTime }}</span>
      </p>

      <!-- Job Type, Salary & Tags -->
      <div class="job-tags">
        <n-tag type="success">{{ formatJobType(job.job_type) }}</n-tag>
        <n-tag v-if="job.salary && job.salary !== 'Not specified'" type="warning">
          💰 {{ job.salary }}
        </n-tag>
      </div>
      <div v-for="(row, index) in splitTagsIntoRows(job.tags, 6)" :key="index" class="job-tags">
        <n-tag v-for="tag in row" :key="tag" type="info">{{ tag }}</n-tag>
      </div>

      <!-- Apply & Save Buttons -->
      <div class="action-buttons">
        <n-button type="primary" @click="openJobPage">
          {{ isApplied ? 'Applied' : 'Apply' }}
        </n-button>
        <n-button type="secondary" @click="toggleSave">
          {{ isSaved ? 'Unsave' : 'Save' }}
        </n-button>
      </div>
    </div>

    <!-- Apply Confirmation Panel -->
    <div v-if="showApplyConfirmation" class="apply-confirmation">
      <p>Did you complete your application?</p>
      <div class="button-group">
        <n-button type="success" @click="confirmApplication">Yes, I Applied</n-button>
        <n-button type="error" @click="cancelApplication">No, Cancel</n-button>
      </div>
    </div>

    <!-- Job Description -->
    <div class="job-description">
      <h3>About the job</h3>
      <div class="formatted-description" v-html="formatDescription(job.description)"></div>
    </div>
  </div>

  <!-- Message When No Jobs Are Found -->
  <div v-else class="no-jobs-container">
    <p>No jobs available. Please try again later.</p>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useJobStore } from '@/stores/jobs'
import { NButton, NAvatar, NTag, NIcon } from 'naive-ui'

export default defineComponent({
  components: { NButton, NAvatar, NTag, NIcon },
  props: {
    job: Object,
    isSaved: Boolean,
    isApplied: Boolean,
  },
  setup(props) {
    const jobStore = useJobStore()
    const showApplyConfirmation = ref(false)

    /**
     * Computes the company logo URL.
     * Uses a placeholder image if no valid logo is available.
     */
    const computedLogo = computed(() => {
      return props.job?.company_logo?.startsWith('http')
        ? props.job.company_logo
        : 'https://via.placeholder.com/50?text=No+Logo'
    })

    /**
     * Computes the reposted time based on the job's publication date.
     * Returns a human-readable string indicating how long ago the job was reposted.
     */
    const repostedTime = computed(() => {
      if (!props.job?.publication_date) return 'Reposted recently'
      const pubDate = new Date(props.job.publication_date)
      const now = new Date()
      const diffDays = Math.ceil(Math.abs(now - pubDate) / (1000 * 60 * 60 * 24))

      return diffDays === 0
        ? 'Reposted today'
        : diffDays === 1
          ? 'Reposted yesterday'
          : `Reposted ${diffDays} days ago`
    })

    /**
     * Opens the job application page in a new tab and shows confirmation.
     */
    const openJobPage = () => {
      window.open(props.job.url, '_blank')
      if (!props.isApplied) {
        showApplyConfirmation.value = true
      }
    }

    /**
     * Confirms the job application and updates the application state in the store.
     */
    const confirmApplication = () => {
      jobStore.applyJob(props.job.id)
      showApplyConfirmation.value = false
    }

    /**
     * Cancels the application confirmation panel.
     */
    const cancelApplication = () => {
      showApplyConfirmation.value = false
    }

    /**
     * Toggles the saved state of a job.
     */
    const toggleSave = async () => {
      await jobStore.toggleSave(props.job.id)
    }

    /**
     * Formats job descriptions by replacing line breaks and bullet points for better readability.
     */
    const formatDescription = (text) => {
      return text
        ? text.replace(/\n/g, '<br>').replace(/- /g, '• ')
        : '<p>No description available.</p>'
    }

    /**
     * Formats job types by replacing underscores with spaces and capitalizing each word.
     */
    const formatJobType = (jobType) => {
      if (!jobType) return ''
      return jobType
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    /**
     * Splits job tags into rows for better display layout.
     */
    const splitTagsIntoRows = (tags, maxPerRow) => {
      if (!tags || tags.length === 0) return []
      return tags.reduce((acc, tag, index) => {
        const rowIndex = Math.floor(index / maxPerRow)
        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex].push(tag)
        return acc
      }, [])
    }

    /**
     * Watches for job changes and clears the application confirmation panel when switching jobs.
     */
    watch(
      () => props.job?.id,
      (newJobId, oldJobId) => {
        if (!newJobId || newJobId !== oldJobId) {
          showApplyConfirmation.value = false
        }
      },
    )

    return {
      computedLogo,
      repostedTime,
      openJobPage,
      confirmApplication,
      cancelApplication,
      toggleSave,
      showApplyConfirmation,
      formatDescription,
      splitTagsIntoRows,
      formatJobType,
    }
  },
})
</script>

<style scoped>
.job-details-container {
  width: 75%;
  padding: 20px;
  overflow-y: auto;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Source Sans Pro', sans-serif;
}

.no-jobs-container {
  width: 100%;
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
}

.job-title {
  font-size: 22px;
  font-weight: bold;
  color: #0073b1;
}

.job-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}

.apply-confirmation {
  margin-top: 20px;
  padding: 15px;
  background: #fff7e6;
  border: 1px solid #ffa500;
  border-radius: 5px;
  text-align: center;
  gap: 5px;
}

.apply-confirmation p {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.job-description {
  margin-top: 20px;
}

.formatted-description {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}
</style>
