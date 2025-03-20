/**
 * Authentication Middleware
 *
 * This middleware verifies JWT tokens for protected routes.
 * If the token is valid, it attaches the decoded user data to the request object.
 */

const jwt = require('jsonwebtoken')

/**
 * Middleware to verify JWT token from the request headers.
 * @param {Object} req - The request object containing headers.
 * @param {Object} res - The response object for sending responses.
 * @param {Function} next - The next middleware function in the request pipeline.
 * @returns {void} Sends a response if the token is missing or invalid.
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(403).json({ error: 'Access Denied' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid Token' })
  }
}

module.exports = verifyToken
