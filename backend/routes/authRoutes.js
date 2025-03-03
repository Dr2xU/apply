const express = require('express')
const { registerUser, loginUser } = require('../controllers/authController')

module.exports = (usersContainer) => {
  const router = express.Router()

  router.post('/register', (req, res) => registerUser(req, res, usersContainer))
  router.post('/login', (req, res) => loginUser(req, res, usersContainer))

  return router
}
