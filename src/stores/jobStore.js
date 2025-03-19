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
  const displayCount = ref(10) // This controls how many jobs are displayed at once

  const getFilteredJobs = computed(() => {
    console.log('Computing filtered jobs with filters:', {
      search: searchQuery.value,
      category: selectedCategory.value,
      location: selectedLocation.value,
      filter: selectedFilter.value,
    })

    // Filter jobs based on criteria
    const filtered = jobs.value.filter((job) => {
      const matchesState =
        selectedFilter.value === 'all' ||
        (selectedFilter.value === 'new' && !seenJobs.value.has(job.id)) ||
        (selectedFilter.value === 'seen' && seenJobs.value.has(job.id)) ||
        (selectedFilter.value === 'applied' && appliedJobs.value.has(job.id)) ||
        (selectedFilter.value === 'saved' && savedJobs.value.has(job.id))

      const searchRegex = new RegExp(searchQuery.value, 'i')
      const matchesSearch =
        !searchQuery.value ||
        searchRegex.test(job.title) ||
        searchRegex.test(job.company_name) ||
        (job.job_type && searchRegex.test(job.job_type)) ||
        (job.salary && job.salary !== 'Not specified' && searchRegex.test(job.salary)) ||
        (job.tags && job.tags.some((tag) => searchRegex.test(tag)))

      const matchesCategory = !selectedCategory.value || job.category === selectedCategory.value

      const jobLocations = job.candidate_required_location
        ? job.candidate_required_location.split(',').map((loc) => loc.trim())
        : []
      const matchesLocation =
        !selectedLocation.value || jobLocations.includes(selectedLocation.value)

      return matchesState && matchesSearch && matchesCategory && matchesLocation
    })

    // Sort by publication date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.publication_date || 0)
      const dateB = new Date(b.publication_date || 0)
      return dateB - dateA
    })
  })

  // This will return only the jobs up to the displayCount
  const getLimitedJobs = computed(() => {
    return filteredJobs.value.slice(0, displayCount.value)
  })

  const updateFilteredJobs = (selectFirstJob = false) => {
    console.log('🔄 updateFilteredJobs() START')
    console.log('🔄 Current filter values:', {
      searchQuery: searchQuery.value,
      selectedCategory: selectedCategory.value,
      selectedLocation: selectedLocation.value,
      selectedFilter: selectedFilter.value,
    })

    console.log('🔄 About to call getFilteredJobs computed property...')
    const filteredResult = getFilteredJobs.value
    console.log('🔄 getFilteredJobs returned:', filteredResult.length, 'items')

    filteredJobs.value = filteredResult
    console.log('🔄 filteredJobs updated to:', filteredJobs.value.length, 'items')

    // Reset displayCount to 10 whenever filters change
    displayCount.value = 10

    // Check if we're in a "reset" state (no filters selected)
    const noFiltersSelected =
      !searchQuery.value &&
      !selectedCategory.value &&
      !selectedLocation.value &&
      selectedFilter.value === 'all'

    if ((selectFirstJob || noFiltersSelected) && filteredJobs.value.length > 0) {
      console.log('🔄 About to select first job...')
      selectJob(filteredJobs.value[0])
    } else if (filteredJobs.value.length === 0) {
      // Clear selected job when no jobs are found
      console.log('🔄 No jobs found, clearing selected job')
      selectedJob.value = null
    }

    console.log('🔄 updateFilteredJobs() COMPLETE')
  }

  const forceUpdateJobs = async () => {
    try {
      loading.value = true
      console.log('🔄 Force updating jobs...')

      // Use the imported updateJobs function with a force parameter
      await updateJobs(true)

      // Fetch the updated jobs
      const allJobs = await getJobs()
      const { seenJobs: seen, savedJobs: saved, appliedJobs: applied } = await getUserJobs()

      console.log('✅ Force Updated Jobs:', allJobs.length)
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
      console.log('✅ Jobs force updated:', jobs.value.length)
      updateFilteredJobs(true)

      return { success: true, message: 'Jobs successfully updated' }
    } catch (error) {
      console.error('❌ Error force updating jobs:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const updateFilters = ({ searchQuery: sQ, selectedCategory: sC, selectedLocation: sL }) => {
    console.log('📌 updateFilters() START with params:', { sQ, sC, sL })
    console.log('📌 Current state before update:', {
      searchQuery: searchQuery.value,
      selectedCategory: selectedCategory.value,
      selectedLocation: selectedLocation.value,
    })

    // Explicitly assign values one by one and log each change
    if (sQ !== undefined) {
      searchQuery.value = sQ
      console.log('📌 searchQuery updated to:', searchQuery.value)
    }

    if (sC !== undefined) {
      selectedCategory.value = sC
      console.log('📌 selectedCategory updated to:', selectedCategory.value)
    }

    if (sL !== undefined) {
      selectedLocation.value = sL
      console.log('📌 selectedLocation updated to:', selectedLocation.value)
    }

    console.log('📌 About to call updateFilteredJobs...')
    updateFilteredJobs(true)
    console.log('📌 updateFilters() COMPLETE')
  }

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

  const fetchJobs = async () => {
    try {
      loading.value = true
      console.log('📡 Fetching jobs...')

      await updateJobs()
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

  // Reset pagination back to 10 items
  const resetPagination = () => {
    displayCount.value = 10
  }

  // Increment displayCount by 10 to load more jobs
  const loadMoreJobs = () => {
    console.log('📌 Loading more jobs, current count:', displayCount.value)
    // Only load more if there are more jobs to load
    if (displayCount.value < filteredJobs.value.length) {
      displayCount.value += 10
      console.log('📌 Increased display count to:', displayCount.value)
    }
  }

  const selectFirstJob = async () => {
    if (filteredJobs.value.length > 0) {
      // No need for additional sorting since getFilteredJobs already sorts by date
      const latestJob = filteredJobs.value[0]
      selectJob(latestJob)

      if (!seenJobs.value.has(latestJob.id)) {
        try {
          await markJobAsSeen(latestJob.id)
          seenJobs.value.add(latestJob.id)
          console.log(`👀 Latest job marked as seen: ${latestJob.title}`)
        } catch (error) {
          console.error('❌ Error marking latest job as seen:', error)
        }
      }
    } else {
      selectedJob.value = null
    }
  }

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

  const toggleSave = async (jobId) => {
    if (savedJobs.value.has(jobId)) {
      await deleteSavedJob(jobId)
      savedJobs.value.delete(jobId)
    } else {
      await markJobAsSaved(jobId)
      savedJobs.value.add(jobId)
    }
    updateFilteredJobs()
  }

  const applyJob = async (jobId) => {
    if (!appliedJobs.value.has(jobId)) {
      await markJobAsApplied(jobId)
      appliedJobs.value.add(jobId)
    }
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
    forceUpdateJobs,
    updateFilteredJobs,
    updateFilters,
    setFilter,
    fetchJobs,
    updateFilterOptions,
    resetPagination,
    loadMoreJobs,
    selectFirstJob,
    selectJob,
    toggleSave,
    applyJob,
  }
})
