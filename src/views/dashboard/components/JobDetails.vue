<template>
  <div class="job-details-container" v-if="job">
    <div class="job-header">
      <!-- ✅ Company Logo and Name -->
      <div class="company-info">
        <n-avatar :src="computedLogo" size="large" class="company-logo" />
        <div>
          <h3 class="company-name">{{ job.company_name }}</h3>
          <p class="job-location">{{ job.candidate_required_location }}</p>
        </div>
      </div>

      <!-- ✅ Job Title -->
      <h2 class="job-title">{{ job.title }}</h2>

      <!-- ✅ Metadata: Date, Applicants -->
      <p class="job-meta">
        <span>{{ repostedTime }}</span> · <span>Over 100 people clicked apply</span>
      </p>

      <!-- ✅ Job Type, Salary & Tags (Max 5 per row) -->
      <div class="job-tags">
        <n-tag type="success">{{ job.job_type }}</n-tag>
        <n-tag v-if="job.salary && job.salary !== 'Not specified'" type="warning">
          💰 {{ job.salary }}
        </n-tag>
      </div>
      <div v-for="(row, index) in splitTagsIntoRows(job.tags, 5)" :key="index" class="job-tags">
        <n-tag v-for="tag in row" :key="tag" type="info">{{ tag }}</n-tag>
      </div>

      <!-- ✅ Apply & Save Buttons -->
      <div class="action-buttons">
        <n-button type="primary" tag="a" :href="job.url" target="_blank">
          Apply
          <n-icon :component="ExternalLinkOutline" />
        </n-button>
        <n-button secondary>Save</n-button>
      </div>
    </div>

    <!-- ✅ Viewed Status -->
    <p v-if="isViewed" class="viewed-text">👀 Viewed</p>

    <!-- ✅ About the Job -->
    <div class="job-description">
      <h3>About the job</h3>
      <div class="formatted-description" v-html="formatDescription(job.description)"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { NButton, NAvatar, NTag, NIcon } from 'naive-ui'

export default defineComponent({
  components: { NButton, NAvatar, NTag, NIcon },
  props: {
    job: Object,
    isViewed: Boolean, // ✅ Preserve "Viewed" status
  },
  computed: {
    computedLogo() {
      return this.job.company_logo && this.job.company_logo.startsWith('http')
        ? this.job.company_logo
        : 'https://via.placeholder.com/50?text=No+Logo'
    },
    repostedTime() {
      if (!this.job.publication_date) return 'Reposted recently'

      const pubDate = new Date(this.job.publication_date)
      const now = new Date()
      const diffTime = Math.abs(now - pubDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'Reposted today'
      if (diffDays === 1) return 'Reposted yesterday'
      if (diffDays < 7) return `Reposted ${diffDays} days ago`
      if (diffDays < 14) return `Reposted 1 week ago`
      return `Reposted ${Math.floor(diffDays / 7)} weeks ago`
    },
  },
  methods: {
    formatDescription(text) {
      return text
        ? text.replace(/\n/g, '<br>').replace(/- /g, '• ')
        : '<p>No description available.</p>'
    },
    splitTagsIntoRows(tags, maxPerRow) {
      if (!tags || tags.length === 0) return []
      return tags.reduce((acc, tag, index) => {
        const rowIndex = Math.floor(index / maxPerRow)
        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex].push(tag)
        return acc
      }, [])
    },
  },
})
</script>

<style scoped>
.job-details-container {
  width: 65%;
  padding: 20px;
  overflow-y: auto;
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

/* ✅ Viewed Status */
.viewed-text {
  font-size: 14px;
  color: #777;
  margin-top: 10px;
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
