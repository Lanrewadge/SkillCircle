const jwtAuth = require('../../src/middleware/jwtAuth')
const jwt = require('jsonwebtoken')

// Mock jwt
jest.mock('jsonwebtoken')

describe('JWT Auth Middleware', () => {
  let mockReq, mockRes, mockNext

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null
    }
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    mockNext = jest.fn()
    jest.clearAllMocks()
  })

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'student'
      }

      const expectedPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      }

      jwt.sign.mockReturnValue('mock-token')

      const token = jwtAuth.generateAccessToken(user)

      expect(jwt.sign).toHaveBeenCalledWith(
        expectedPayload,
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '15m',
          issuer: 'skillcircle',
          audience: 'skillcircle-users'
        }
      )
      expect(token).toBe('mock-token')
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        role: 'student'
      }

      const expectedPayload = {
        id: user.id,
        email: user.email,
        type: 'refresh'
      }

      jwt.sign.mockReturnValue('mock-refresh-token')

      const token = jwtAuth.generateRefreshToken(user)

      expect(jwt.sign).toHaveBeenCalledWith(
        expectedPayload,
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
          issuer: 'skillcircle',
          audience: 'skillcircle-users'
        }
      )
      expect(token).toBe('mock-refresh-token')
    })
  })

  describe('authenticateToken', () => {
    it('should authenticate valid token', () => {
      const mockPayload = {
        id: '1',
        email: 'test@example.com',
        role: 'student',
        type: 'access'
      }

      mockReq.headers.authorization = 'Bearer valid-token'
      jwt.verify.mockReturnValue(mockPayload)

      jwtAuth.authenticateToken(mockReq, mockRes, mockNext)

      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-token',
        process.env.JWT_SECRET,
        {
          issuer: 'skillcircle',
          audience: 'skillcircle-users'
        }
      )
      expect(mockReq.user).toEqual(mockPayload)
      expect(mockNext).toHaveBeenCalled()
    })

    it('should reject request without authorization header', () => {
      jwtAuth.authenticateToken(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token is required'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should reject request with invalid authorization format', () => {
      mockReq.headers.authorization = 'InvalidFormat token'

      jwtAuth.authenticateToken(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token format'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should reject invalid token', () => {
      mockReq.headers.authorization = 'Bearer invalid-token'
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      jwtAuth.authenticateToken(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired token'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should reject blacklisted token', () => {
      const mockPayload = {
        id: '1',
        email: 'test@example.com',
        role: 'student',
        type: 'access'
      }

      mockReq.headers.authorization = 'Bearer blacklisted-token'
      jwt.verify.mockReturnValue(mockPayload)

      // Add token to blacklist
      jwtAuth.blacklistToken('blacklisted-token')

      jwtAuth.authenticateToken(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token has been revoked'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const mockPayload = {
        id: '1',
        email: 'test@example.com',
        type: 'refresh'
      }

      jwt.verify.mockReturnValue(mockPayload)

      const result = jwtAuth.verifyRefreshToken('valid-refresh-token')

      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-refresh-token',
        process.env.JWT_REFRESH_SECRET,
        {
          issuer: 'skillcircle',
          audience: 'skillcircle-users'
        }
      )
      expect(result).toEqual(mockPayload)
    })

    it('should throw error for invalid refresh token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      expect(() => {
        jwtAuth.verifyRefreshToken('invalid-refresh-token')
      }).toThrow('Invalid token')
    })
  })

  describe('blacklistToken', () => {
    it('should add token to blacklist', () => {
      const token = 'token-to-blacklist'

      jwtAuth.blacklistToken(token)

      // Verify token is blacklisted by checking if authentication fails
      const mockPayload = {
        id: '1',
        email: 'test@example.com',
        role: 'student',
        type: 'access'
      }

      mockReq.headers.authorization = `Bearer ${token}`
      jwt.verify.mockReturnValue(mockPayload)

      jwtAuth.authenticateToken(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token has been revoked'
      })
    })
  })

  describe('findUserById', () => {
    it('should find existing user by id', () => {
      const testUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      }

      jwtAuth.users.push(testUser)

      const foundUser = jwtAuth.findUserById('1')

      expect(foundUser).toEqual(testUser)
    })

    it('should return null for non-existent user', () => {
      const foundUser = jwtAuth.findUserById('non-existent-id')

      expect(foundUser).toBeNull()
    })
  })

  describe('findUserByEmail', () => {
    it('should find existing user by email', () => {
      const testUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      }

      jwtAuth.users.push(testUser)

      const foundUser = jwtAuth.findUserByEmail('john@example.com')

      expect(foundUser).toEqual(testUser)
    })

    it('should return null for non-existent email', () => {
      const foundUser = jwtAuth.findUserByEmail('non-existent@example.com')

      expect(foundUser).toBeNull()
    })
  })

  describe('createUser', () => {
    it('should create a new user', () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
        role: 'student'
      }

      const newUser = jwtAuth.createUser(userData)

      expect(newUser).toMatchObject({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role
      })
      expect(newUser.id).toBeDefined()
      expect(newUser.createdAt).toBeDefined()
      expect(newUser.updatedAt).toBeDefined()

      // Verify user was added to users array
      const foundUser = jwtAuth.findUserById(newUser.id)
      expect(foundUser).toEqual(newUser)
    })
  })

  describe('roleAuthorization', () => {
    it('should allow access for authorized role', () => {
      const authorizeRole = jwtAuth.roleAuthorization(['admin', 'tutor'])

      mockReq.user = {
        id: '1',
        email: 'admin@example.com',
        role: 'admin'
      }

      authorizeRole(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalled()
    })

    it('should deny access for unauthorized role', () => {
      const authorizeRole = jwtAuth.roleAuthorization(['admin'])

      mockReq.user = {
        id: '1',
        email: 'student@example.com',
        role: 'student'
      }

      authorizeRole(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should deny access when user role is not set', () => {
      const authorizeRole = jwtAuth.roleAuthorization(['admin'])

      mockReq.user = {
        id: '1',
        email: 'user@example.com'
      }

      authorizeRole(mockReq, mockRes, mockNext)

      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})