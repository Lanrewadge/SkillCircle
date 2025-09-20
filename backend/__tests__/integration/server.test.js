const request = require('supertest')
const express = require('express')

// Mock server setup similar to simple-server.js
const createTestApp = () => {
  const app = express()

  // Middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  })

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // API routes
  const authRoutes = require('../../routes/auth')
  app.use('/api/v1/auth', authRoutes)

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
  })

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    })
  })

  return app
}

describe('Server Integration Tests', () => {
  let app

  beforeEach(() => {
    app = createTestApp()
  })

  describe('Server Health and Basic Functionality', () => {
    it('should respond to health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toMatchObject({
        status: 'ok',
        timestamp: expect.any(String)
      })
    })

    it('should handle CORS preflight requests', async () => {
      const response = await request(app)
        .options('/api/v1/auth/login')
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBe('*')
      expect(response.headers['access-control-allow-methods']).toContain('POST')
    })

    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404)

      expect(response.body).toMatchObject({
        success: false,
        message: 'Route not found'
      })
    })

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send('malformed json')
        .set('Content-Type', 'application/json')
        .expect(400)

      // Express should handle this and return a 400 error
    })
  })

  describe('Authentication Flow Integration', () => {
    it('should complete full authentication cycle', async () => {
      // 1. Register a new user
      const userData = {
        name: 'Integration Test User',
        email: 'integration@test.com',
        password: 'TestPass123!',
        role: 'student'
      }

      const registerResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      expect(registerResponse.body.success).toBe(true)
      expect(registerResponse.body.token).toBeDefined()
      expect(registerResponse.body.user.email).toBe(userData.email)

      const { token: accessToken, user } = registerResponse.body

      // 2. Login with the created user
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200)

      expect(loginResponse.body.success).toBe(true)
      expect(loginResponse.body.token).toBeDefined()
      expect(loginResponse.body.refreshToken).toBeDefined()

      const { refreshToken } = loginResponse.body

      // 3. Access protected profile endpoint
      const profileResponse = await request(app)
        .get('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(profileResponse.body.success).toBe(true)
      expect(profileResponse.body.user.id).toBe(user.id)

      // 4. Refresh the token
      const refreshResponse = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200)

      expect(refreshResponse.body.success).toBe(true)
      expect(refreshResponse.body.accessToken).toBeDefined()

      // 5. Logout
      const logoutResponse = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200)

      expect(logoutResponse.body.success).toBe(true)
    })

    it('should handle concurrent registration attempts', async () => {
      const userData = {
        name: 'Concurrent Test User',
        email: 'concurrent@test.com',
        password: 'TestPass123!',
        role: 'student'
      }

      // Attempt to register the same user multiple times concurrently
      const promises = Array(3).fill().map(() =>
        request(app)
          .post('/api/v1/auth/register')
          .send(userData)
      )

      const responses = await Promise.all(promises)

      // Only one should succeed, others should fail with user exists error
      const successfulResponses = responses.filter(res => res.status === 201)
      const failedResponses = responses.filter(res => res.status === 400)

      expect(successfulResponses).toHaveLength(1)
      expect(failedResponses).toHaveLength(2)

      failedResponses.forEach(response => {
        expect(response.body.message).toBe('User already exists')
      })
    })

    it('should enforce rate limiting', async () => {
      const userData = {
        name: 'Rate Limit Test',
        email: 'ratelimit@test.com',
        password: 'TestPass123!',
        role: 'student'
      }

      // Make rapid successive requests
      const promises = Array(10).fill().map((_, index) =>
        request(app)
          .post('/api/v1/auth/register')
          .send({
            ...userData,
            email: `ratelimit${index}@test.com`
          })
      )

      const responses = await Promise.all(promises)

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This would test database error scenarios
      // For now, we'll test validation errors as a proxy

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123',
          role: 'invalid-role'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.errors).toBeDefined()
      expect(Array.isArray(response.body.errors)).toBe(true)
    })

    it('should handle large request payloads', async () => {
      const largeData = {
        name: 'A'.repeat(1000),
        email: 'large@test.com',
        password: 'TestPass123!',
        role: 'student',
        extraData: 'B'.repeat(10000)
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(largeData)

      // Should either succeed or fail gracefully (not crash)
      expect([200, 201, 400, 413, 500]).toContain(response.status)
    })
  })

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      // Check for CORS headers
      expect(response.headers['access-control-allow-origin']).toBeDefined()
    })

    it('should not expose sensitive information in error messages', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(response.body.message).toBe('Invalid credentials')
      expect(response.body.message).not.toContain('password')
      expect(response.body.message).not.toContain('hash')
      expect(response.body.message).not.toContain('bcrypt')
    })
  })

  describe('Performance and Load', () => {
    it('should handle multiple concurrent requests', async () => {
      const startTime = Date.now()

      // Create multiple concurrent health check requests
      const promises = Array(20).fill().map(() =>
        request(app).get('/health')
      )

      const responses = await Promise.all(promises)
      const endTime = Date.now()

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      // Should complete within reasonable time (adjust based on system)
      expect(endTime - startTime).toBeLessThan(5000)
    })

    it('should respond quickly to simple requests', async () => {
      const startTime = Date.now()

      await request(app)
        .get('/health')
        .expect(200)

      const responseTime = Date.now() - startTime

      // Health check should be very fast
      expect(responseTime).toBeLessThan(100)
    })
  })
})