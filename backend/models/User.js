/**
 * User Model
 *
 * This module handles user-related operations in CosmosDB,
 * including creating a user and retrieving a user by email.
 */

const { database } = require('../config/db')
const bcrypt = require('bcryptjs')

const container = database.container('users')

/**
 * User Class
 *
 * Represents a user entity with an email and hashed password.
 */
class User {
  /**
   * Constructs a new User instance.
   * @param {string} email - The user's email address.
   * @param {string} password - The hashed password.
   */
  constructor(email, password) {
    this.id = email
    this.email = email
    this.password = password
  }
}

/**
 * Creates a new user and stores it in the database.
 * @param {string} email - The email of the user.
 * @param {string} password - The plain text password of the user.
 * @returns {Promise<Object>} The created user resource from the database.
 */
const createUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User(email, hashedPassword)
    const { resource } = await container.items.create(user)
    return resource
  } catch (err) {
    console.error('❌ Error creating user:', err.message || err)
    throw new Error('Failed to create user')
  }
}

/**
 * Finds a user by their email address.
 * @param {string} email - The email to search for.
 * @returns {Promise<Object|null>} The user object if found, otherwise null.
 */
const findUserByEmail = async (email) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @email',
      parameters: [{ name: '@email', value: email }],
    }
    const { resources } = await container.items.query(querySpec).fetchAll()
    return resources.length ? resources[0] : null
  } catch (err) {
    console.error('❌ Error finding user:', err.message || err)
    throw new Error('Failed to retrieve user')
  }
}

module.exports = { createUser, findUserByEmail }
