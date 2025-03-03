<template>
  <div class="filter-panel">
    <!-- ✅ Job Categories -->
    <div
      class="filter-category"
      v-for="filter in filters"
      :key="filter.value"
      @click="setFilter(filter.value)"
    >
      <img :src="filter.icon" alt="icon" class="nav-icon-img" />
      {{ filter.label }}
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { NButton, NIcon } from 'naive-ui'

export default defineComponent({
  components: { NButton, NIcon },
  setup() {
    const selectedFilter = ref('all')

    const worldIcon = new URL('@/assets/world.svg', import.meta.url).href
    const persoIcon = new URL('@/assets/personalized.svg', import.meta.url).href
    const viewedIcon = new URL('@/assets/viewed.svg', import.meta.url).href
    const savedIcon = new URL('@/assets/bookmark.svg', import.meta.url).href

    const filters = [
      { label: 'All', value: 'all', icon: worldIcon },
      { label: 'For you', value: 'for you', icon: persoIcon },
      { label: 'Viewed', value: 'viewed', icon: viewedIcon },
      { label: 'Saved', value: 'saved', icon: savedIcon },
    ]
    const setFilter = (filter) => {
      selectedFilter.value = filter
      console.log('Filter selected:', filter)
      emit('refresh-jobs', filter)
    }

    return { filters, selectedFilter, setFilter }
  },
})
</script>

<style scoped>
.filter-panel {
  display: flex;
  width: 100%;
  gap: 20px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.filter-category {
  margin-left: 150px;
  display: flex;
  align-items: center;
  padding-left: 120px;
}

.nav-icon-img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
