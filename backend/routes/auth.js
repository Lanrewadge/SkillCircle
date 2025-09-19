const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  authenticateToken,
  comparePassword,
  getUserByEmail,
  getUserById,
  createUser,
  updateLastLogin,
  revokeAccessToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  getTokenInfo
} = require('../src/middleware/jwtAuth');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 registration attempts per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later.',
    code: 'REGISTRATION_RATE_LIMIT'
  }
});

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['student', 'teacher'])
    .withMessage('Role must be either student or teacher')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register new user
router.post('/register', registerLimiter, validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password, name, role = 'student', skills = [], bio = '' } = req.body;

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        code: 'USER_EXISTS'
      });
    }

    // Create new user
    const newUser = await createUser({
      email,
      password,
      name,
      role,
      skills,
      bio
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const { token: refreshToken, tokenId } = generateRefreshToken(newUser);

    // Remove password from response
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      isEmailVerified: newUser.isEmailVerified,
      skills: newUser.skills,
      bio: newUser.bio,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: '15m'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login user
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { email, password, rememberMe = false } = req.body;

    // Find user by email
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Update last login
    updateLastLogin(user.id);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const { token: refreshToken, tokenId } = generateRefreshToken(user);

    // Remove password from response
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      skills: user.skills,
      bio: user.bio,
      lastLoginAt: user.lastLoginAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: '15m'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

// Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
        code: 'REFRESH_TOKEN_MISSING'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    const user = getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      tokens: {
        accessToken: newAccessToken,
        tokenType: 'Bearer',
        expiresIn: '15m'
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: error.message,
      code: 'REFRESH_FAILED'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      skills: user.skills,
      bio: user.bio,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    };

    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      code: 'PROFILE_ERROR'
    });
  }
});

// Update user profile
router.put('/me', authenticateToken, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const { name, bio, skills } = req.body;

    // Update user data
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;

    // Save updated user (in real app, save to database)
    const { users } = require('../src/middleware/jwtAuth');
    users.set(user.id, user);

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      skills: user.skills,
      bio: user.bio,
      profilePicture: user.profilePicture
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      code: 'UPDATE_ERROR'
    });
  }
});

// Logout (revoke current access token)
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Revoke access token
    revokeAccessToken(req.token);

    // Revoke refresh token if provided
    if (refreshToken) {
      try {
        const decoded = verifyRefreshToken(refreshToken);
        revokeRefreshToken(decoded.tokenId);
      } catch (error) {
        // Refresh token might be invalid, but continue with logout
        console.log('Invalid refresh token during logout:', error.message);
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Logout from all devices
router.post('/logout-all', authenticateToken, (req, res) => {
  try {
    // Revoke current access token
    revokeAccessToken(req.token);

    // Revoke all refresh tokens for the user
    revokeAllRefreshTokens(req.user.id);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout from all devices failed',
      code: 'LOGOUT_ALL_ERROR'
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
        code: 'VALIDATION_ERROR'
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const { hashPassword } = require('../src/middleware/jwtAuth');
    user.password = await hashPassword(newPassword);

    // Save updated user (in real app, save to database)
    const { users } = require('../src/middleware/jwtAuth');
    users.set(user.id, user);

    // Revoke all refresh tokens to force re-login on other devices
    revokeAllRefreshTokens(user.id);

    res.json({
      success: true,
      message: 'Password changed successfully. Please log in again on other devices.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      code: 'CHANGE_PASSWORD_ERROR'
    });
  }
});

// Get token information
router.get('/token-info', authenticateToken, (req, res) => {
  try {
    const tokenInfo = getTokenInfo(req.token);

    res.json({
      success: true,
      tokenInfo: {
        ...tokenInfo,
        isValid: true,
        timeUntilExpiry: Math.max(0, tokenInfo.expiresAt.getTime() - Date.now())
      }
    });
  } catch (error) {
    console.error('Token info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get token information',
      code: 'TOKEN_INFO_ERROR'
    });
  }
});

module.exports = router;