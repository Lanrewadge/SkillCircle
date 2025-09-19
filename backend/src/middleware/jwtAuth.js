const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'skillcircle-super-secret-jwt-key-2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'skillcircle-refresh-secret-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// In-memory storage for refresh tokens (in production, use Redis or database)
const refreshTokenStore = new Map();
const tokenBlacklist = new Set();

// Mock user database (in production, use actual database)
const users = new Map([
  ['1', {
    id: '1',
    email: 'john@example.com',
    password: '$2a$10$rOiMZ8VJz1eG8Z1YxYxYoOKzKzKzKzKzKzKzKzKzKzKzKzKzKzKzK', // 'password123'
    name: 'John Doe',
    role: 'student',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    profilePicture: null,
    skills: ['JavaScript', 'React'],
    bio: 'Passionate learner and developer'
  }],
  ['2', {
    id: '2',
    email: 'sarah@example.com',
    password: '$2a$10$rOiMZ8VJz1eG8Z1YxYxYoOKzKzKzKzKzKzKzKzKzKzKzKzKzKzKzK', // 'password123'
    name: 'Sarah Chen',
    role: 'teacher',
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    profilePicture: null,
    skills: ['React', 'Node.js', 'TypeScript'],
    bio: 'Senior developer with 8+ years experience'
  }]
]);

// Generate access token
const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    type: 'access'
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'skillcircle',
    audience: 'skillcircle-users'
  });
};

// Generate refresh token
const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    type: 'refresh',
    tokenId: Date.now().toString() + Math.random().toString(36)
  };

  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'skillcircle',
    audience: 'skillcircle-users'
  });

  // Store refresh token
  refreshTokenStore.set(payload.tokenId, {
    userId: user.id,
    token,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    isActive: true
  });

  return { token, tokenId: payload.tokenId };
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    if (tokenBlacklist.has(token)) {
      throw new Error('Token has been revoked');
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'skillcircle',
      audience: 'skillcircle-users'
    });

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    throw new Error(`Invalid access token: ${error.message}`);
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'skillcircle',
      audience: 'skillcircle-users'
    });

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Check if token exists in store and is active
    const storedToken = refreshTokenStore.get(decoded.tokenId);
    if (!storedToken || !storedToken.isActive || storedToken.token !== token) {
      throw new Error('Refresh token not found or inactive');
    }

    // Check if token has expired
    if (new Date() > storedToken.expiresAt) {
      refreshTokenStore.delete(decoded.tokenId);
      throw new Error('Refresh token has expired');
    }

    return decoded;
  } catch (error) {
    throw new Error(`Invalid refresh token: ${error.message}`);
  }
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    const decoded = verifyAccessToken(token);
    const user = users.get(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    };

    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
      code: 'TOKEN_INVALID'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = users.get(decoded.id);

      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        };
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredRoles,
        current: userRoles
      });
    }

    next();
  };
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Revoke access token (add to blacklist)
const revokeAccessToken = (token) => {
  tokenBlacklist.add(token);
};

// Revoke refresh token
const revokeRefreshToken = (tokenId) => {
  const storedToken = refreshTokenStore.get(tokenId);
  if (storedToken) {
    storedToken.isActive = false;
    refreshTokenStore.set(tokenId, storedToken);
  }
};

// Revoke all refresh tokens for a user
const revokeAllRefreshTokens = (userId) => {
  for (const [tokenId, tokenData] of refreshTokenStore.entries()) {
    if (tokenData.userId === userId) {
      tokenData.isActive = false;
      refreshTokenStore.set(tokenId, tokenData);
    }
  }
};

// Clean up expired tokens (should be run periodically)
const cleanupExpiredTokens = () => {
  const now = new Date();
  for (const [tokenId, tokenData] of refreshTokenStore.entries()) {
    if (now > tokenData.expiresAt) {
      refreshTokenStore.delete(tokenId);
    }
  }
};

// Get user by email
const getUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return user;
    }
  }
  return null;
};

// Get user by ID
const getUserById = (id) => {
  return users.get(id);
};

// Create new user
const createUser = async (userData) => {
  const id = (users.size + 1).toString();
  const hashedPassword = await hashPassword(userData.password);

  const newUser = {
    id,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    name: userData.name,
    role: userData.role || 'student',
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    profilePicture: null,
    skills: userData.skills || [],
    bio: userData.bio || ''
  };

  users.set(id, newUser);
  return newUser;
};

// Update user last login
const updateLastLogin = (userId) => {
  const user = users.get(userId);
  if (user) {
    user.lastLoginAt = new Date().toISOString();
    users.set(userId, user);
  }
};

// Token info
const getTokenInfo = (token) => {
  try {
    const decoded = jwt.decode(token);
    return {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role,
      type: decoded.type,
      issuedAt: new Date(decoded.iat * 1000),
      expiresAt: new Date(decoded.exp * 1000),
      issuer: decoded.iss,
      audience: decoded.aud
    };
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateToken,
  optionalAuth,
  requireRole,
  hashPassword,
  comparePassword,
  revokeAccessToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  cleanupExpiredTokens,
  getUserByEmail,
  getUserById,
  createUser,
  updateLastLogin,
  getTokenInfo,
  users // Export for demo purposes
};