<template>
  <n-card
    class="job-card"
    :class="{ viewed: isViewed, selected: isSelected }"
    @click="$emit('select-job', job)"
  >
    <div class="job-card-content">
      <n-avatar v-if="computedLogo" :src="computedLogo" size="large" class="job-logo" />
      <div class="job-info">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="company-name">{{ job.company_name }}</p>
        <p v-if="isViewed && !isSelected" class="viewed-text">👀 Viewed</p>
      </div>
    </div>
  </n-card>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { NCard, NAvatar } from 'naive-ui'

export default defineComponent({
  components: { NCard, NAvatar },
  props: {
    job: Object,
    isViewed: Boolean, // ✅ Track if job is viewed
    isSelected: Boolean, // ✅ Track if job is selected
  },
  computed: {
    computedLogo() {
      console.log('🔹 Checking job logo:', this.job.company_logo)
      return this.job.company_logo && this.job.company_logo.startsWith('http')
        ? this.job.company_logo
        : 'https://via.placeholder.com/50?text=No+Logo'
    },
  },
  emits: ['select-job'],
})
</script>

<style scoped>
/* ✅ Default Job Card Style */
.job-card {
  display: flex;
  padding: 5px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  transition:
    background 0.2s ease-in-out,
    border 0.2s ease-in-out;
}

/* ✅ Hover Effect */
.job-card:hover {
  background: #f3f3f3;
}

/* ✅ Style for Viewed Jobs */
.job-card.viewed {
  background: #e6f7ff; /* Light blue background */
}

/* ✅ Style for Selected Job */
.job-card.selected {
  background: #d1e8ff; /* Slightly darker blue */
  border-left: 4px solid #0073b1; /* Blue border */
  font-weight: bold;
}

/* ✅ Layout */
.job-card-content {
  display: flex;
  width: 100%;
  align-items: center;
}

/* ✅ Job Logo */
.job-logo {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  border-radius: 5px;
}

/* ✅ Job Info */
.job-info {
  flex-grow: 1;
  margin-left: 12px;
}

/* ✅ Job Title */
.job-title {
  font-size: 15px;
  color: #0073b1;
  font-weight: 600;
  cursor: pointer;
}

/* ✅ Company Name */
.company-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
}

/* ✅ Viewed Text */
.viewed-text {
  font-size: 12px;
  color: #777;
  margin-top: 4px;
}
</style>
