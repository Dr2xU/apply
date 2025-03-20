<template>
  <div class="filter-panel">
    <div
      v-for="(filter, index) in filters"
      :key="filter.value"
      class="filter-category"
      :class="{ active: jobStore.selectedFilter === filter.value }"
      @click="setFilter(filter.value)"
      @mouseenter="hoverIndex = index"
      @mouseleave="hoverIndex = null"
      role="button"
      :aria-pressed="jobStore.selectedFilter === filter.value"
      tabindex="0"
      :style="getHoverStyle(index)"
      @keydown.enter.space="setFilter(filter.value)"
    >
      {{ filter.label }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useJobStore } from '@/stores/jobs'

const jobStore = useJobStore()
const hoverIndex = ref(null)

/**
 * Job filter options
 */
const filters = computed(() => [
  { label: '🌍 All', value: 'all' },
  { label: '🎯 New', value: 'new' },
  { label: '👀 Seen', value: 'seen' },
  { label: '⏳ Applied', value: 'applied' },
  { label: '💾 Saved', value: 'saved' },
])

/**
 * Returns dynamic hover styles based on proximity to hovered filter
 */
const getHoverStyle = (index) => {
  if (hoverIndex.value === null) return {}

  const distance = Math.abs(hoverIndex.value - index)
  const scale = [1.1, 1.05, 1.02][distance] || 1

  return {
    transform: `scale(${scale})`,
    transition: 'transform 0.2s ease-in-out',
  }
}

/**
 * Updates selected filter and refreshes job list
 * @param {string} filter - Selected filter value
 */
const setFilter = (filter) => {
  if (jobStore.selectedFilter !== filter) {
    console.log('🔄 Applying Filter:', filter)
    jobStore.selectedFilter = filter
    jobStore.updateFilteredJobs(true)

    // Ensure job list resets to top after filter change
    nextTick(() => {
      document.querySelector('.job-list')?.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }
}
</script>

<style scoped>
.filter-panel {
  display: flex;
  width: 100%;
  gap: 15px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px;
  border-bottom: 2px solid #ddd;
  background: #f9f9f9;
  justify-content: center;
  font-family: 'Source Sans Pro', sans-serif;
}

.filter-category {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: #e0e0e0;
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    background 0.3s ease;
  user-select: none;
  margin-bottom: 5px;
  margin-top: 15px;
}

.filter-category:hover {
  background: #d6d6d6;
}

.filter-category.active {
  background: #0073b1;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
