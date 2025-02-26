const express = require('express')
const { fetchAndSaveJobs, getSavedJobs } = require('../controllers/remoteJobsController')

const router = express.Router()

router.get('/fetch', fetchAndSaveJobs)
router.get('/saved', getSavedJobs)

module.exports = router
