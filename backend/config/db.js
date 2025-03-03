const { CosmosClient } = require('@azure/cosmos')
require('dotenv').config()

const endpoint = process.env.COSMOS_ENDPOINT
const key = process.env.COSMOS_KEY
const databaseId = process.env.COSMOS_DATABASE
const containerUsersId = process.env.COSMOS_CONTAINER_USERS
const containerJobsId = process.env.COSMOS_CONTAINER_JOBS

if (!endpoint || !key || !databaseId || !containerUsersId || !containerJobsId) {
  console.error('❌ Missing CosmosDB credentials in .env file.')
  process.exit(1)
}

const cosmosClient = new CosmosClient({ endpoint, key })

const setupDatabase = async () => {
  try {
    console.log(`🔄 Connecting to CosmosDB: ${databaseId}...`)
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId })
    console.log(`✅ Connected to CosmosDB: ${databaseId}`)

    // ✅ Ensure Users container exists
    const { container: users } = await database.containers.createIfNotExists({
      id: containerUsersId,
      partitionKey: { kind: 'Hash', paths: ['/id'] },
    })
    console.log(`✅ Users container ready: ${users.id}`)

    // ✅ Ensure Jobs container exists
    const { container: jobs } = await database.containers.createIfNotExists({
      id: containerJobsId,
      partitionKey: { kind: 'Hash', paths: ['/id'] },
    })
    console.log(`✅ Jobs container ready: ${jobs.id}`)

    // ✅ Ensure `jobs` is defined
    if (!jobs) {
      throw new Error('❌ Jobs container was not initialized.')
    }

    return { users, jobs } // ✅ Return both users & jobs
  } catch (err) {
    console.error('❌ CosmosDB Connection Error:', err)
    process.exit(1)
  }
}

module.exports = { setupDatabase, cosmosClient }
