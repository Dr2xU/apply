const axios = require('axios')

const apiClient = axios.create({
  baseURL: 'https://remotive.com/api', // ✅ Ensure this is correct
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

module.exports = apiClient
