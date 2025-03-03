const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// 🔹 Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
}

// 📌 Register User
exports.registerUser = async (req, res, usersContainer) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // 🔹 Check if user already exists
    const { resources: existingUsers } = await usersContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }],
      })
      .fetchAll()

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists. Please log in.' })
    }

    // 🔹 Hash Password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 🔹 Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
    }

    // 🔹 Save to CosmosDB
    await usersContainer.items.create(newUser)

    res.status(201).json({ message: '✅ User registered successfully!' })
  } catch (err) {
    console.error('❌ Registration Error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}

// 📌 Login User
exports.loginUser = async (req, res, usersContainer) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // 🔹 Find User
    const { resources: users } = await usersContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }],
      })
      .fetchAll()

    const user = users[0]

    // 🔹 Generate JWT Token
    const token = generateToken(user)

    res.json({ message: '✅ Login successful!', token, email: user.email, userId: user.id }) // ✅ Return userId
  } catch (err) {
    console.error('❌ Login Error:', err)
    res.status(500).json({ error: 'Server error', details: err.message })
  }
}
