<template>
  <n-card
    class="job-card"
    :class="{ seen: isSeen, applied: isApplied, saved: isSaved, selected: isSelected }"
    @click="$emit('select-job', job)"
    @keydown.enter.space="$emit('select-job', job)"
    role="button"
    :aria-label="`Select job: ${job.title} at ${job.company_name}`"
    :aria-selected="isSelected"
    tabindex="0"
  >
    <div class="job-card-content">
      <n-avatar
        v-if="computedLogo"
        :src="computedLogo"
        size="large"
        class="job-logo"
        :alt="`Company logo of ${job.company_name}`"
      />

      <div class="job-info">
        <h3 class="job-title">{{ job.title }}</h3>

        <p class="company-name">{{ job.company_name }}</p>

        <div class="state-icons">
          <span v-if="isSeen && !isApplied && !isSelected" class="state-text" aria-label="Job seen"
            >👀</span
          >
          <span v-if="isApplied && !isSelected" class="state-text" aria-label="Job applied"
            >⏳</span
          >
          <span v-if="isSaved && !isSelected" class="state-text" aria-label="Job saved">💾</span>
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
    /**
     * Computes the job logo URL.
     * If the company logo is unavailable or invalid, a placeholder image is used.
     */
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
.job-card {
  display: flex;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  transition: all 0.2s ease-in-out;
  font-family: 'Source Sans Pro', sans-serif;
}

.job-card:hover {
  background: #f9f9f9;
  transform: scale(1.02);
}

.job-card.viewed {
  background: #e6f7ff;
}

.job-card.selected {
  background: #d1e8ff;
  border-left: 4px solid #0073b1;
  font-weight: bold;
  transition:
    background-color 0.1s ease-in-out,
    border-left 0.1s ease-in-out,
    transform 0.1s ease-in-out;
}

.job-card.selected:hover {
  transform: scale(1.02);
}

.job-card-content {
  display: flex;
  width: 100%;
  align-items: center;
}

.job-logo {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  border-radius: 5px;
  object-fit: cover;
}

.job-info {
  flex-grow: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.job-title {
  font-size: 15px;
  color: #0073b1;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2px;
}

.company-name {
  font-size: 13px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.state-icons {
  display: flex;
  gap: 6px;
}

.state-text {
  font-size: 14px;
  color: #555;
  transition: opacity 0.2s ease-in-out;
}

.state-text:hover {
  opacity: 0.8;
}

.debug-text {
  font-size: 12px;
  color: gray;
}
</style>
