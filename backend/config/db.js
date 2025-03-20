/**
 * Database Configuration
 *
 * This module connects to Azure CosmosDB and ensures the existence of the required containers.
 * It provides a setup function to initialize the database and a utility function to retrieve the last job update timestamp.
 */

require('dotenv').config()
const { CosmosClient } = require('@azure/cosmos')

// Load environment variables for database connection
const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY
const databaseId = process.env.COSMOS_DATABASE
const containerUsersId = process.env.COSMOS_CONTAINER_USERS
const containerJobsId = process.env.COSMOS_CONTAINER_JOBS

// Validate required environment variables
if (!endpoint || !key || !databaseId || !containerUsersId || !containerJobsId) {
  console.error('❌ Missing CosmosDB credentials in .env file.')
  throw new Error('Missing CosmosDB credentials.')
}

// Initialize CosmosDB client
const cosmosClient = new CosmosClient({ endpoint, key })

// Singleton references to prevent multiple connections
let database, users, jobs

/**
 * Sets up the CosmosDB database and ensures that required containers exist.
 * @returns {Promise<{ users: Object, jobs: Object }>} Database containers.
 */
const setupDatabase = async () => {
  try {
    // Return existing connection if already initialized
    if (database && users && jobs) return { users, jobs }

    console.log(`🔄 Connecting to CosmosDB: ${databaseId}...`)
    const { database: dbInstance } = await cosmosClient.databases.createIfNotExists({
      id: databaseId,
    })
    database = dbInstance
    console.log(`✅ Connected to CosmosDB: ${databaseId}`)

    // Ensure Users container exists
    const { container: usersContainer } = await database.containers.createIfNotExists({
      id: containerUsersId,
      partitionKey: { kind: 'Hash', paths: ['/id'] },
    })
    users = usersContainer
    console.log(`✅ Users container initialized: ${users.id}`)

    // Ensure Jobs container exists
    const { container: jobsContainer } = await database.containers.createIfNotExists({
      id: containerJobsId,
      partitionKey: { kind: 'Hash', paths: ['/id'] },
    })
    jobs = jobsContainer
    console.log(`✅ Jobs container initialized: ${jobs.id}`)

    return { users, jobs }
  } catch (err) {
    console.error('❌ CosmosDB Connection Error:', err)
    throw new Error('Failed to connect to CosmosDB')
  }
}

/**
 * Retrieves the last job update timestamp from the database.
 * @param {Object} jobsContainer - The CosmosDB jobs container.
 * @returns {Promise<Date|null>} The last update timestamp or null if not found.
 */
const getLastJobUpdateTimestamp = async (jobsContainer) => {
  try {
    if (!jobsContainer) {
      console.error('❌ Jobs container is not initialized.')
      return null
    }

    const { resources } = await jobsContainer.items
      .query('SELECT c.timestamp FROM c WHERE c.id = "last_update_timestamp"')
      .fetchAll()

    if (!resources.length || !resources[0].timestamp) {
      console.warn('⚠ No timestamp found in DB.')
      return null
    }

    const timestamp = new Date(resources[0].timestamp)
    return isNaN(timestamp) ? null : timestamp
  } catch (error) {
    console.error('❌ Error retrieving last update timestamp:', error)
    return null
  }
}

module.exports = { setupDatabase, getLastJobUpdateTimestamp }
