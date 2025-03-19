require('dotenv').config()
const { CosmosClient } = require('@azure/cosmos')

const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY
const databaseId = process.env.COSMOS_DATABASE
const containerUsersId = process.env.COSMOS_CONTAINER_USERS
const containerJobsId = process.env.COSMOS_CONTAINER_JOBS

if (!endpoint || !key || !databaseId || !containerUsersId || !containerJobsId) {
  console.error('❌ Missing CosmosDB credentials in .env file.')
  throw new Error('Missing CosmosDB credentials.')
}

const cosmosClient = new CosmosClient({ endpoint, key })

let database, users, jobs // Singleton references

const setupDatabase = async () => {
  try {
    if (database && users && jobs) return { users, jobs } // ✅ Use existing connections

    console.log(`🔄 Connecting to CosmosDB: ${databaseId}...`)
    const { database: dbInstance } = await cosmosClient.databases.createIfNotExists({
      id: databaseId,
    })
    database = dbInstance
    console.log(`✅ Connected to CosmosDB: ${databaseId}`)

    // ✅ Ensure Users container exists
    const { container: usersContainer } = await database.containers.createIfNotExists({
      id: containerUsersId,
      partitionKey: { kind: 'Hash', paths: ['/id'] },
    })
    users = usersContainer
    console.log(`✅ Users container ready: ${users.id}`)

    // ✅ Ensure Jobs container exists
    const { container: jobsContainer } = await database.containers.createIfNotExists({
      id: containerJobsId,
      partitionKey: { kind: 'Hash', paths: ['/id'] },
    })
    jobs = jobsContainer
    console.log(`✅ Jobs container ready: ${jobs.id}`)

    return { users, jobs }
  } catch (err) {
    console.error('❌ CosmosDB Connection Error:', err)
    throw new Error('Failed to connect to CosmosDB')
  }
}

// ✅ Ensure jobs is initialized before querying
const getLastJobUpdateTimestamp = async (jobsContainer) => {
  try {
    if (!jobsContainer) {
      console.error('❌ jobs container is not initialized.')
      return null
    }

    const { resources } = await jobsContainer.items
      .query('SELECT c.timestamp FROM c WHERE c.id = "last_update_timestamp"')
      .fetchAll()

    if (!resources.length || !resources[0].timestamp) {
      console.log('⚠ No timestamp found in DB.')
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
