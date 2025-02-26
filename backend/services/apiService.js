const axios = require('axios')

const apiClient = axios.create({
  baseURL: 'https://remotive.io/api',
  timeout: 5000,
})

module.exports = apiClient
