<template>
  <div class="filter-panel">
    <!-- ✅ Job Filters with Active State -->
    <div
      class="filter-category"
      v-for="(filter, index) in filters"
      :key="filter.value"
      :class="{ active: jobStore.selectedFilter === filter.value }"
      @click="setFilter(filter.value)"
      @mouseenter="hoverIndex = index"
      @mouseleave="hoverIndex = null"
      role="button"
      aria-pressed="jobStore.selectedFilter === filter.value"
      tabindex="0"
      :style="getHoverStyle(index)"
    >
      {{ filter.label }}
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useJobStore } from '@/stores/jobStore'

const jobStore = useJobStore()
const hoverIndex = ref(null)

const filters = [
  { label: '🌍 All', value: 'all' },
  { label: '🎯 For you', value: 'for you' },
  { label: '🎉 New', value: 'new' },
  { label: '👀 Seen', value: 'seen' },
  { label: '⏳ Applied', value: 'applied' },
  { label: '💾 Saved', value: 'saved' },
]

const getHoverStyle = (index) => {
  if (hoverIndex.value === null) return {}

  const distance = Math.abs(hoverIndex.value - index)
  let scale = 1

  if (distance === 0)
    scale = 1.1 // Center filter (hovered) enlarges
  else if (distance === 1)
    scale = 1.05 // Neighbors slightly enlarge
  else if (distance === 2) scale = 1.01 // Further neighbors get a small effect

  return {
    transform: `scale(${scale})`,
    transition: 'transform 0.2s ease-in-out',
  }
}

const setFilter = (filter) => {
  if (jobStore.selectedFilter !== filter) {
    console.log('🔄 Filter selected:', filter)
    jobStore.selectedFilter = filter
    jobStore.updateFilteredJobs(true) // ✅ Refresh job list and select first job

    nextTick(() => {
      const jobListContainer = document.querySelector('.job-list')
      if (jobListContainer) {
        jobListContainer.scrollTop = 0
      }
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
  margin-top: 5px;
  justify-content: center;
}

.filter-category {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
}

.filter-category:hover {
  background: #d6d6d6;
}

.filter-category.active {
  background: #0073b1;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
