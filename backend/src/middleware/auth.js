const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

// Mock user database
const users = new Map([
  ['1', {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'USER',
    avatar: '/avatars/john.jpg',
    isActive: true
  }],
  ['2', {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'TEACHER',
    avatar: '/avatars/jane.jpg',
    isActive: true
  }],
  ['admin', {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@skillcircle.com',
    role: 'ADMIN',
    avatar: '/avatars/admin.jpg',
    isActive: true
  }]
])

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d'
  })
}

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Protect middleware - requires authentication
const protect = asyncHandler(async (req, res, next) => {
  let token

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    })
  }

  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }

  // Get user from database
  const user = users.get(decoded.userId)
  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'User not found or inactive'
    })
  }

  req.user = user
  next()
})

// Optional authentication - doesn't fail if no token
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]

    const decoded = verifyToken(token)
    if (decoded) {
      const user = users.get(decoded.userId)
      if (user && user.isActive) {
        req.user = user
      }
    }
  }

  next()
})

// Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      })
    }

    next()
  }
}

// Check if user owns resource or is admin
const ownerOrAdmin = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      })
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField]

    if (req.user.role === 'ADMIN' || req.user.id === resourceUserId) {
      return next()
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    })
  }
}

// Rate limiting by user
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map()

  return (req, res, next) => {
    if (!req.user) {
      return next()
    }

    const userId = req.user.id
    const now = Date.now()
    const windowStart = now - windowMs

    if (!userRequests.has(userId)) {
      userRequests.set(userId, [])
    }

    const requests = userRequests.get(userId)

    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    userRequests.set(userId, validRequests)

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }

    // Add current request
    validRequests.push(now)
    next()
  }
}

// Mock login for development
const mockLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // In a real app, you'd verify password hash
  const user = Array.from(users.values()).find(u => u.email === email)

  if (!user || password !== 'password123') {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  const token = generateToken(user.id)

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token
    }
  })
})

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  })
})

module.exports = {
  generateToken,
  verifyToken,
  protect,
  optionalAuth,
  authorize,
  ownerOrAdmin,
  userRateLimit,
  mockLogin,
  getCurrentUser,
  users // Export for testing
}