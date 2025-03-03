// models/User.js
const { database } = require('../config/db')
const bcrypt = require('bcryptjs')

const container = database.container('users')

class User {
  constructor(email, password) {
    this.id = email
    this.email = email
    this.password = password
  }
}

const createUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User(email, hashedPassword)
    const { resource } = await container.items.create(user)
    return resource
  } catch (err) {
    console.error('Error creating user:', err)
    throw err
  }
}

const findUserByEmail = async (email) => {
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.id = @email',
    parameters: [{ name: '@email', value: email }],
  }
  const { resources } = await container.items.query(querySpec).fetchAll()
  return resources.length ? resources[0] : null
}

module.exports = { createUser, findUserByEmail }
