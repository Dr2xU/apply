const cron = require('node-cron')
const { fetchAndSaveJobs } = require('../controllers/remoteJobController')

const scheduleJobUpdates = () => {
  cron.schedule('0 */6 * * *', async () => {
    console.log('🔄 Running scheduled job update...')
    try {
      await fetchAndSaveJobs()
      console.log('✅ Remote jobs updated successfully.')
    } catch (error) {
      console.error('❌ Error updating remote jobs:', error.message)
    }
  })
}

module.exports = { scheduleJobUpdates }
