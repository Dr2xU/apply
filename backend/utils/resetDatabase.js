require('dotenv').config() // ✅ Ensures .env is loaded

const { setupDatabase } = require('../config/db')

const resetDatabase = async () => {
  try {
    console.log('🔄 Connecting to the database...')
    const { users, jobs } = await setupDatabase()

    if (!users || !jobs) {
      throw new Error('❌ Database containers not initialized.')
    }

    console.log('🗑️ Deleting all documents from the Jobs collection...')
    const { resources: jobDocs } = await jobs.items.readAll().fetchAll()
    for (const doc of jobDocs) {
      await jobs.item(doc.id, doc.id).delete()
    }

    console.log('🗑️ Deleting all documents from the Users collection...')
    const { resources: userDocs } = await users.items.readAll().fetchAll()
    for (const doc of userDocs) {
      await users.item(doc.id, doc.id).delete()
    }

    console.log('✅ Database cleaned successfully.')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error resetting database:', error)
    process.exit(1)
  }
}

resetDatabase()
