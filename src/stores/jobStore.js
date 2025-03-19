import { defineStore } from 'pinia'
import { ref, computed, nextTick } from 'vue'
import { getJobs, updateJobs } from '@/api/jobs'
import {
  markJobAsSeen,
  markJobAsSaved,
  deleteSavedJob,
  markJobAsApplied,
  getUserJobs,
} from '@/api/users'

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref([])
  const filteredJobs = ref([])
  const searchQuery = ref('')
  const selectedCategory = ref(null)
  const selectedLocation = ref(null)
  const selectedFilter = ref('all')
  const seenJobs = ref(new Set())
  const savedJobs = ref(new Set())
  const appliedJobs = ref(new Set())
  const categoryOptions = ref([])
  const locationOptions = ref([])
  const loading = ref(false)
  const selectedJob = ref(null)
  const displayCount = ref(10)

  // ✅ Computed: Filter jobs dynamically based on search, category, and location
  const getFilteredJobs = computed(() => {
    return jobs.value.filter((job) => {
      const matchesState =
        selectedFilter.value === 'all' ||
        (selectedFilter.value === 'new' && !seenJobs.value.has(job.id)) ||
        (selectedFilter.value === 'seen' && seenJobs.value.has(job.id)) ||
        (selectedFilter.value === 'applied' && appliedJobs.value.has(job.id)) ||
        (selectedFilter.value === 'saved' && savedJobs.value.has(job.id))

      const matchesSearch =
        !searchQuery.value ||
        job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesCategory = !selectedCategory.value || job.category === selectedCategory.value

      const jobLocations = job.candidate_required_location
        ? job.candidate_required_location.split(',').map((loc) => loc.trim())
        : []
      const matchesLocation =
        !selectedLocation.value || jobLocations.includes(selectedLocation.value)

      return matchesState && matchesSearch && matchesCategory && matchesLocation
    })
  })

  // ✅ Computed: Limit jobs dynamically for pagination
  const getLimitedJobs = computed(() => filteredJobs.value.slice(0, displayCount.value))

  // ✅ Update filtered jobs dynamically when filters change
  const updateFilteredJobs = (selectFirstJob = false) => {
    filteredJobs.value = getFilteredJobs.value
    console.log('🔄 Filtered jobs updated:', filteredJobs.value.length)
    displayCount.value = 10 // Reset pagination

    if (selectFirstJob && filteredJobs.value.length > 0) {
      selectJob(filteredJobs.value[0]) // Auto-select first job
    }

    nextTick(() => {
      const jobListContainer = document.querySelector('.job-list')
      if (jobListContainer) {
        jobListContainer.scrollTop = 0
      }
    })
  }

  // ✅ Update filters dynamically based on input changes
  const updateFilters = ({ searchQuery: sQ, selectedCategory: sC, selectedLocation: sL }) => {
    console.log('📌 updateFilters() Triggered!')
    console.log('🔄 New Filters:', { sQ, sC, sL })

    if (searchQuery.value !== sQ) searchQuery.value = sQ
    if (selectedCategory.value !== sC) selectedCategory.value = sC
    if (selectedLocation.value !== sL) selectedLocation.value = sL

    updateFilteredJobs(true) // Auto-refresh job list
  }

  // ✅ Update selected filter (used in FilterPanel)
  const setFilter = (filter) => {
    if (selectedFilter.value !== filter) {
      console.log('🔄 Filter selected:', filter)
      selectedFilter.value = filter
      updateFilteredJobs(true)

      nextTick(() => {
        const jobListContainer = document.querySelector('.job-list')
        if (jobListContainer) {
          jobListContainer.scrollTop = 0
        }
      })
    }
  }

  // ✅ Fetch Jobs from API (Initial Call)
  const fetchJobs = async () => {
    try {
      loading.value = true
      console.log('📡 Fetching jobs...')

      await updateJobs() // Ensure database is up to date
      const allJobs = await getJobs()
      const { seenJobs: seen, savedJobs: saved, appliedJobs: applied } = await getUserJobs()

      console.log('✅ Fetched Jobs:', allJobs.length)
      console.log('👀 Seen Jobs:', seen.length)
      console.log('💾 Saved Jobs:', saved.length)
      console.log('⏳ Applied Jobs:', applied.length)

      jobs.value = allJobs.map((job) => ({
        ...job,
        isSeen: seen.includes(job.id),
        isSaved: saved.includes(job.id),
        isApplied: applied.includes(job.id),
      }))

      seenJobs.value = new Set(seen)
      savedJobs.value = new Set(saved)
      appliedJobs.value = new Set(applied)

      updateFilterOptions()
      console.log('✅ Jobs loaded:', jobs.value.length)
      updateFilteredJobs(true)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
    } finally {
      loading.value = false
    }
  }

  // ✅ Generate category & location options dynamically
  const updateFilterOptions = () => {
    console.log('📌 Updating filter options from jobs...')

    const categories = new Set()
    jobs.value.forEach((job) => {
      if (job.category) categories.add(job.category)
    })
    categoryOptions.value = [...categories]
      .sort((a, b) => a.localeCompare(b))
      .map((cat) => ({ label: cat, value: cat }))

    const locations = new Set()
    jobs.value.forEach((job) => {
      if (job.candidate_required_location) {
        job.candidate_required_location
          .split(',')
          .map((loc) => loc.trim())
          .forEach((loc) => locations.add(loc))
      }
    })
    locationOptions.value = [...locations]
      .sort((a, b) => a.localeCompare(b))
      .map((loc) => ({ label: loc, value: loc }))

    console.log('✅ Category Options:', categoryOptions.value)
    console.log('✅ Location Options (sorted):', locationOptions.value)
  }

  // ✅ Pagination Controls
  const resetPagination = () => {
    displayCount.value = 10
  }

  const loadMoreJobs = () => {
    if (displayCount.value <= filteredJobs.value.length) {
      displayCount.value += 10
    }
  }

  // ✅ Auto-select first job
  const selectFirstJob = async () => {
    if (filteredJobs.value.length > 0) {
      selectJob(filteredJobs.value[0])

      if (!seenJobs.value.has(selectedJob.value.id)) {
        try {
          await markJobAsSeen(selectedJob.value.id)
          seenJobs.value.add(selectedJob.value.id)
          console.log(`👀 First job marked as seen: ${selectedJob.value.title}`)
        } catch (error) {
          console.error('❌ Error marking first job as seen:', error)
        }
      }
    } else {
      selectedJob.value = null
    }
  }

  // ✅ Select job & mark as seen
  const selectJob = async (job) => {
    selectedJob.value = job
    if (!seenJobs.value.has(job.id)) {
      await markJobAsSeen(job.id)
      seenJobs.value.add(job.id)
    }

    nextTick(() => {
      const jobDetailsContainer = document.querySelector('.job-details-container')
      if (jobDetailsContainer) {
        jobDetailsContainer.scrollTop = 0
      }
    })
  }

  return {
    jobs,
    filteredJobs,
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedFilter,
    seenJobs,
    savedJobs,
    appliedJobs,
    categoryOptions,
    locationOptions,
    loading,
    selectedJob,
    displayCount,
    getFilteredJobs,
    getLimitedJobs,
    updateFilteredJobs,
    updateFilters,
    setFilter,
    fetchJobs,
    updateFilterOptions,
    resetPagination,
    loadMoreJobs,
    selectFirstJob,
    selectJob,
  }
})
