const request = require('supertest')
const express = require('express')
const authRoutes = require('../../routes/auth')
const jwtAuth = require('../../src/middleware/jwtAuth')

// Mock the JWT middleware
jest.mock('../../src/middleware/jwtAuth')

const app = express()
app.use(express.json())
app.use('/api/v1/auth', authRoutes)

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the users array
    jwtAuth.users = []
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.token).toBeDefined()
      expect(response.body.user).toMatchObject({
        name: userData.name,
        email: userData.email,
        role: userData.role
      })
      expect(response.body.user.password).toBeUndefined()
    })

    it('should reject registration with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'TestPass123!',
        role: 'student'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].msg).toContain('valid email')
    })

    it('should reject registration with weak password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
        role: 'student'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].msg).toContain('at least 8 characters')
    })

    it('should reject registration with missing required fields', async () => {
      const userData = {
        email: 'john@example.com',
        password: 'TestPass123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })

    it('should reject registration with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      // First registration
      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      // Second registration with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User already exists')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Register a test user
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
    })

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'TestPass123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Login successful')
      expect(response.body.token).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
      expect(response.body.user).toMatchObject({
        email: loginData.email
      })
    })

    it('should reject login with invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject login with invalid password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject login with missing fields', async () => {
      const loginData = {
        email: 'john@example.com'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
    })
  })

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken

    beforeEach(async () => {
      // Register and login to get refresh token
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      await request(app)
        .post('/api/v1/auth/register')
        .send(userData)

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })

      refreshToken = loginResponse.body.refreshToken
    })

    it('should refresh token successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.accessToken).toBeDefined()
      expect(response.body.refreshToken).toBeDefined()
    })

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(403)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid refresh token')
    })

    it('should reject refresh with missing token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({})
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Refresh token is required')
    })
  })

  describe('GET /api/v1/auth/profile', () => {
    let accessToken, userId

    beforeEach(async () => {
      // Register and login to get access token
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)

      accessToken = registerResponse.body.token
      userId = registerResponse.body.user.id

      // Mock the JWT middleware to authenticate the user
      jwtAuth.authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: userId }
        next()
      })
    })

    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      })
      expect(response.body.user.password).toBeUndefined()
    })

    it('should reject profile request without token', async () => {
      jwtAuth.authenticateToken.mockImplementation((req, res, next) => {
        return res.status(401).json({
          success: false,
          message: 'Access token is required'
        })
      })

      const response = await request(app)
        .get('/api/v1/auth/profile')
        .expect(401)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Access token is required')
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    let accessToken, refreshToken, userId

    beforeEach(async () => {
      // Register and login
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)

      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })

      accessToken = loginResponse.body.token
      refreshToken = loginResponse.body.refreshToken
      userId = registerResponse.body.user.id

      // Mock the JWT middleware
      jwtAuth.authenticateToken.mockImplementation((req, res, next) => {
        req.user = { id: userId }
        next()
      })
    })

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Logout successful')
    })

    it('should handle logout without refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Logout successful')
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limiting on registration', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        role: 'student'
      }

      // Make multiple rapid requests
      const promises = Array(6).fill().map(() =>
        request(app)
          .post('/api/v1/auth/register')
          .send(userData)
      )

      const responses = await Promise.all(promises)

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })

    it('should enforce rate limiting on login', async () => {
      // First register a user
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'TestPass123!',
          role: 'student'
        })

      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      }

      // Make multiple rapid failed login attempts
      const promises = Array(6).fill().map(() =>
        request(app)
          .post('/api/v1/auth/login')
          .send(loginData)
      )

      const responses = await Promise.all(promises)

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })
})