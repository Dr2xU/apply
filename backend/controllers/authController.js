/**
 * Authentication Controller
 *
 * Handles user registration and login functionalities using CosmosDB.
 * Utilizes bcrypt for password hashing and JWT for authentication.
 */

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * Generates a JWT token for authenticated users.
 * @param {Object} user - The user object containing id and email.
 * @returns {string} JWT token valid for 1 hour.
 */
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
}

/**
 * Registers a new user in the system and returns a JWT token.
 * @param {Object} req - The request object containing user email and password.
 * @param {Object} res - The response object to send feedback to client.
 * @param {Object} usersContainer - The CosmosDB container for users.
 */
exports.registerUser = async (req, res, usersContainer) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Check if user already exists
    const { resources: existingUsers } = await usersContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }],
      })
      .fetchAll()

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists. Please log in.' })
    }

    // Hash password securely before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user object
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
    }

    // Save user to database
    await usersContainer.items.create(newUser)

    // Generate JWT Token for immediate authentication
    const token = generateToken(newUser)

    res.status(201).json({
      message: '✅ User registered successfully!',
      token,
      userId: newUser.id,
      email: newUser.email,
    })
  } catch (err) {
    console.error('❌ Registration Error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}

/**
 * Logs in a user by validating credentials and generating a JWT token.
 * @param {Object} req - The request object containing user email and password.
 * @param {Object} res - The response object to send feedback to client.
 * @param {Object} usersContainer - The CosmosDB container for users.
 */
exports.loginUser = async (req, res, usersContainer) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Fetch user details from database
    const { resources: users } = await usersContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }],
      })
      .fetchAll()

    const user = users[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT Token
    const token = generateToken(user)

    res.json({ message: '✅ Login successful!', token, email: user.email, userId: user.id })
  } catch (err) {
    console.error('❌ Login Error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}
