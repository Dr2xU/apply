<template>
  <div v-if="job" class="job-details-container">
    <div class="job-header">
      <!-- ✅ Company Logo and Name -->
      <div class="company-info">
        <n-avatar :src="computedLogo" size="large" class="company-logo" />
        <div>
          <h3 class="company-name">{{ job.company_name }}</h3>
          <p class="job-location">{{ job.candidate_required_location }}</p>
        </div>
      </div>

      <h2 class="job-title">{{ job.title }}</h2>
      <p class="job-meta">
        <span>{{ repostedTime }}</span>
      </p>

      <!-- ✅ Job Type, Salary & Tags -->
      <div class="job-tags">
        <n-tag type="success">{{ formatJobType(job.job_type) }}</n-tag>
        <n-tag v-if="job.salary && job.salary !== 'Not specified'" type="warning">
          💰 {{ job.salary }}
        </n-tag>
      </div>
      <div v-for="(row, index) in splitTagsIntoRows(job.tags, 6)" :key="index" class="job-tags">
        <n-tag v-for="tag in row" :key="tag" type="info">{{ tag }}</n-tag>
      </div>

      <!-- ✅ Apply & Save Buttons -->
      <div class="action-buttons">
        <n-button type="primary" @click="openJobPage">
          <n-icon v-if="isApplied" name="check-circle" /> {{ isApplied ? 'Applied' : 'Apply' }}
        </n-button>
        <n-button type="secondary" @click="toggleSave">
          <n-icon v-if="isSaved" name="bookmark" /> {{ isSaved ? 'Unsave' : 'Save' }}
        </n-button>
        <n-button type="info" @click="showCvUploadModal = true">
          <n-icon name="file-text" /> Tailor CV & Cover Letter
        </n-button>
      </div>
    </div>

    <!-- ✅ Apply Confirmation Panel -->
    <div v-if="showApplyConfirmation" class="apply-confirmation">
      <p>Did you complete your application?</p>
      <n-button type="success" @click="confirmApplication">Yes, I Applied</n-button>
      <n-button type="error" @click="cancelApplication">No, Cancel</n-button>
    </div>

    <!-- ✅ Job Description -->
    <div class="job-description">
      <h3>About the job</h3>
      <div class="formatted-description" v-html="formatDescription(job.description)"></div>
    </div>
  </div>

  <!-- ✅ Show Message When No Jobs Are Found -->
  <div v-else class="no-jobs-container">
    <p>No jobs available. Please try again later.</p>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useJobStore } from '@/stores/jobStore'
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

    // ✅ Compute Company Logo
    const computedLogo = computed(() => {
      return props.job?.company_logo?.startsWith('http')
        ? props.job.company_logo
        : 'https://via.placeholder.com/50?text=No+Logo'
    })

    // ✅ Compute Reposted Time
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

    // ✅ Open Job Page & Confirm Application
    const openJobPage = () => {
      window.open(props.job.url, '_blank')
      showApplyConfirmation.value = true
    }

    // ✅ Confirm Application
    const confirmApplication = () => {
      jobStore.applyJob(props.job.id) // ✅ Use Pinia action to apply job
      showApplyConfirmation.value = false
    }

    // ✅ Cancel Application Confirmation
    const cancelApplication = () => {
      showApplyConfirmation.value = false
    }

    // ✅ Toggle Save State Using Pinia
    const toggleSave = async () => {
      await jobStore.toggleSave(props.job.id)
    }

    // ✅ Format Job Description
    const formatDescription = (text) => {
      return text
        ? text.replace(/\n/g, '<br>').replace(/- /g, '• ')
        : '<p>No description available.</p>'
    }

    // Add this method to your setup function
    const formatJobType = (jobType) => {
      if (!jobType) return ''

      // Split by underscore, capitalize first letter of each word, then join with space
      return jobType
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    // ✅ Split Tags into Rows
    const splitTagsIntoRows = (tags, maxPerRow) => {
      if (!tags || tags.length === 0) return []

      // Format each tag first (capitalize)
      const formattedTags = tags.map((tag) => {
        // Handle case where tag might be undefined or not a string
        if (!tag) return ''

        // Split by spaces and capitalize first letter of each word
        return tag
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      })

      // Then arrange into rows
      return formattedTags.reduce((acc, tag, index) => {
        const rowIndex = Math.floor(index / maxPerRow)
        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex].push(tag)
        return acc
      }, [])
    }

    // ✅ Watch for Job Changes & Clear Confirmation
    watch(
      () => props.job?.id,
      (newJobId, oldJobId) => {
        if (!newJobId || newJobId !== oldJobId) {
          showApplyConfirmation.value = false // ✅ Remove confirmation panel when switching jobs
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
/* ✅ Job Details Container */
.job-details-container {
  width: 75%;
  padding: 20px;
  overflow-y: auto;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* ✅ No Jobs Found */
.no-jobs-container {
  width: 100%;
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}

/* ✅ Company Section */
.company-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.company-logo {
  width: 60px;
  height: 60px;
  min-width: 60px;
  min-height: 60px;
  border-radius: 5px;
  object-fit: cover;
}
.company-name {
  font-size: 18px;
  font-weight: bold;
}

/* ✅ Job Title */
.job-title {
  font-size: 22px;
  font-weight: bold;
  margin-top: 10px;
  color: #0073b1;
}

/* ✅ Metadata */
.job-meta {
  font-size: 14px;
  color: #666;
}

/* ✅ Tags */
.job-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ✅ Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}

/* ✅ Apply Confirmation Panel */
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

/* ✅ Job Description */
.job-description {
  margin-top: 20px;
}
.formatted-description {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}
</style>
