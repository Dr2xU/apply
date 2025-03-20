/**
 * Authentication Routes
 *
 * Defines authentication-related endpoints for user registration and login.
 */

const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')

/**
 * Sets up authentication routes for user registration and login.
 * @param {Object} usersContainer - The CosmosDB container for users.
 * @returns {express.Router} Configured Express router.
 */
module.exports = (usersContainer) => {
  const router = express.Router()

  // Route to register a new user
  router.post('/register', (req, res) => registerUser(req, res, usersContainer))

  // Route to log in a user
  router.post('/login', (req, res) => loginUser(req, res, usersContainer))

  return router
}
