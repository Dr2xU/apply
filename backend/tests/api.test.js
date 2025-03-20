/**
 * API Unit Tests
 *
 * Uses Jest and Supertest to test authentication and job fetching endpoints.
 */

const request = require('supertest')
const express = require('express')
const authRoutes = require('../routes/auth')
const jobsRoutes = require('../routes/jobs')

// Mock Express app
const app = express()
app.use(express.json())

// Mock database containers
const mockUsersContainer = {
  items: { create: jest.fn(), query: jest.fn(() => ({ fetchAll: jest.fn() })) },
}
const mockJobsContainer = {
  items: { readAll: jest.fn(() => ({ fetchAll: jest.fn(() => ({ resources: [] })) })) },
}

// Use the routes
app.use('/api/auth', authRoutes(mockUsersContainer))
app.use('/api/jobs', jobsRoutes(mockJobsContainer))

describe('Authentication API', () => {
  it('should return 400 if email or password is missing', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Email and password are required')
  })
})

describe('Job Fetching API', () => {
  it('should return an empty array when no jobs exist', async () => {
    const res = await request(app).get('/api/jobs')
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})
