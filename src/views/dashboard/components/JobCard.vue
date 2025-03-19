<template>
  <n-card
    class="job-card"
    :class="{ seen: isSeen, applied: isApplied, saved: isSaved, selected: isSelected }"
    @click="$emit('select-job', job)"
  >
    <div class="job-card-content">
      <n-avatar v-if="computedLogo" :src="computedLogo" size="large" class="job-logo" />
      <div class="job-info">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="company-name">{{ job.company_name }}</p>

        <!-- ✅ Improved state display -->
        <div class="state-icons">
          <span v-if="isSeen && !isApplied && !isSelected" class="state-text">👀</span>
          <span v-if="isApplied && !isSelected" class="state-text">⏳</span>
          <span v-if="isSaved && !isSelected" class="state-text">💾</span>
        </div>
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
    isSeen: Boolean,
    isSaved: Boolean,
    isApplied: Boolean,
    isSelected: Boolean,
  },
  computed: {
    computedLogo() {
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
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  transition: all 0.2s ease-in-out;
}

/* ✅ Hover Effect */
.job-card:hover {
  background: #f9f9f9;
  transform: scale(1.02);
}

/* ✅ Style for Viewed Jobs */
.job-card.viewed {
  background: #e6f7ff; /* Light blue background */
}

/* ✅ Style for Selected Job */
.job-card.selected {
  background: #d1e8ff;
  border-left: 4px solid #0073b1;
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
  object-fit: cover;
}

/* ✅ Job Info */
.job-info {
  flex-grow: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ✅ Job Title */
.job-title {
  font-size: 15px;
  color: #0073b1;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2px;
}

/* ✅ Company Name */
.company-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

/* ✅ State Icons */
.state-icons {
  display: flex;
  gap: 6px;
}

/* ✅ State Text */
.state-text {
  font-size: 14px;
  color: #555;
  transition: opacity 0.2s ease-in-out;
}

.state-text:hover {
  opacity: 0.8;
}

/* ✅ Debugging */
.debug-text {
  font-size: 12px;
  color: gray;
}
</style>
