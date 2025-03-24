/**
 * Job Store (Pinia)
 *
 * Manages job listings, filtering, user job interactions (seen, saved, applied),
 * and job updates from the API.
 */

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
  // State variables
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

  /**
   * Computes and filters job listings based on selected filters.
   * @returns {Array} Filtered and sorted job list.
   */
  const getFilteredJobs = computed(() => {
    const searchRegex = new RegExp(searchQuery.value, 'i')

    return jobs.value
      .filter((job) => {
        const matchesState =
          selectedFilter.value === 'all' ||
          (selectedFilter.value === 'new' && !seenJobs.value.has(job.id)) ||
          (selectedFilter.value === 'seen' && seenJobs.value.has(job.id)) ||
          (selectedFilter.value === 'applied' && appliedJobs.value.has(job.id)) ||
          (selectedFilter.value === 'saved' && savedJobs.value.has(job.id))

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
      .sort((a, b) => new Date(b.publication_date || 0) - new Date(a.publication_date || 0))
  })

  /**
   * Returns the filtered job list but limited by `displayCount`.
   * @returns {Array} A subset of filtered jobs.
   */
  const getLimitedJobs = computed(() => filteredJobs.value.slice(0, displayCount.value))

  /**
   * Updates the filtered job list and selects the first job if required.
   * @param {boolean} selectFirstJob - Whether to select the first job.
   */
  const updateFilteredJobs = (selectFirstJob = false) => {
    filteredJobs.value = getFilteredJobs.value
    displayCount.value = 10

    if (selectFirstJob && filteredJobs.value.length > 0) {
      selectJob(filteredJobs.value[0])
    } else if (filteredJobs.value.length === 0) {
      selectedJob.value = null
    }
  }

  /**
   * Forces an update of job listings by fetching new data.
   * @returns {Promise<Object>} Success or failure message.
   */
  const forceUpdateJobs = async () => {
    try {
      loading.value = true
      await updateJobs(true)
      await fetchJobs()
      return { success: true, message: 'Jobs successfully updated' }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Updates search and filter parameters and triggers filtering.
   * @param {Object} filters - New filter values.
   */
  const updateFilters = ({ searchQuery: sQ, selectedCategory: sC, selectedLocation: sL }) => {
    if (sQ !== undefined) searchQuery.value = sQ
    if (sC !== undefined) selectedCategory.value = sC
    if (sL !== undefined) selectedLocation.value = sL
    updateFilteredJobs(true)
  }

  /**
   * Updates the currently selected filter.
   * @param {string} filter - The selected filter type.
   */
  const setFilter = (filter) => {
    if (selectedFilter.value !== filter) {
      selectedFilter.value = filter
      updateFilteredJobs(true)

      nextTick(() => {
        const jobListContainer = document.querySelector('.job-list')
        if (jobListContainer) jobListContainer.scrollTop = 0
      })
    }
  }

  /**
   * Fetches jobs from the API and updates state.
   */
  const fetchJobs = async () => {
    try {
      loading.value = true
      await updateJobs()
      const allJobs = await getJobs()
      const { seenJobs: seen, savedJobs: saved, appliedJobs: applied } = await getUserJobs()

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
      updateFilteredJobs(true)
    } catch (error) {
      console.error('❌ Error fetching jobs:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Updates category and location filter options.
   */
  const updateFilterOptions = () => {
    const categories = new Set()
    const locations = new Set()

    jobs.value.forEach((job) => {
      if (job.category) categories.add(job.category)
      if (job.candidate_required_location) {
        job.candidate_required_location
          .split(',')
          .map((loc) => loc.trim())
          .forEach((loc) => locations.add(loc))
      }
    })

    categoryOptions.value = [...categories]
      .sort((a, b) => a.localeCompare(b))
      .map((cat) => ({ label: cat, value: cat }))

    locationOptions.value = [...locations]
      .sort((a, b) => a.localeCompare(b))
      .map((loc) => ({ label: loc, value: loc }))
  }

  /**
   * Selects a job, marks it as seen if necessary, and scrolls to job details.
   * @param {Object} job - The selected job object.
   */
  const selectJob = async (job) => {
    selectedJob.value = job
    if (!seenJobs.value.has(job.id)) {
      await markJobAsSeen(job.id)
      seenJobs.value.add(job.id)
    }
  }

  /**
   * Increment displayCount by 10 to load more jobs.
   */
  const loadMoreJobs = () => {
    console.log('📌 Loading more jobs, current count:', displayCount.value)
    if (displayCount.value < filteredJobs.value.length) {
      displayCount.value += 10
      console.log('📌 Increased display count to:', displayCount.value)
    }
  }

  /**
   * Toggles a job's saved status.
   * @param {string} jobId - Job ID to save/unsave.
   */
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

  /**
   * Marks a job as applied.
   * @param {string} jobId - Job ID to apply to.
   */
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
    selectJob,
    loadMoreJobs,
    toggleSave,
    applyJob,
  }
})
