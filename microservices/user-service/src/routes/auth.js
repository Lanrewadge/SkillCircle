const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const authService = require('../services/authService');
const emailService = require('../services/emailService');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('role').optional().isIn(['STUDENT', 'TEACHER']).withMessage('Invalid role')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

const resetPasswordValidation = [
  body('token').isLength({ min: 1 }).withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Register new user
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName, role = 'STUDENT' } = req.body;
    const { prisma, logger } = req.app.locals;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        emailVerificationToken,
        preferences: {
          create: {} // Create with default preferences
        }
      },
      include: {
        preferences: true
      }
    });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, emailVerificationToken, `${firstName} ${lastName}`);
    } catch (emailError) {
      logger.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'register',
        description: 'User account created',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
      email: user.email,
      emailVerificationRequired: true
    });

  } catch (error) {
    req.app.locals.logger.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    });
  }
});

// Login user
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email, password, rememberMe = false } = req.body;
    const { prisma, redis, logger } = req.app.locals;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { preferences: true }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({
        error: 'Account Locked',
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = user.failedLoginAttempts + 1;
      const updateData = { failedLoginAttempts: failedAttempts };

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });

      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid credentials'
      });
    }

    // Check user status
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account is suspended'
      });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Account is inactive'
      });
    }

    // Generate tokens
    const sessionId = uuidv4();
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    const refreshToken = jwt.sign({ userId: user.id, sessionId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: rememberMe ? '30d' : '7d'
    });

    // Create session
    const expiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));
    const refreshExpiresAt = new Date(Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));

    await prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionId,
        refreshToken,
        deviceInfo: {
          userAgent: req.headers['user-agent'],
          ip: req.ip
        },
        ipAddress: req.ip,
        expiresAt,
        refreshExpiresAt
      }
    });

    // Store session in Redis
    await redis.setEx(`session:${user.id}`, 3600, sessionId);

    // Reset failed attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        loginCount: { increment: 1 }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'login',
        description: 'User logged in',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        preferences: user.preferences
      }
    });

  } catch (error) {
    req.app.locals.logger.error('Login error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login'
    });
  }
});

// Logout user
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const { prisma, redis, logger } = req.app.locals;
    const userId = req.user.userId;
    const sessionId = req.user.sessionId;

    // Invalidate session in database
    await prisma.session.update({
      where: { sessionToken: sessionId },
      data: {
        isActive: false,
        revokedAt: new Date()
      }
    });

    // Remove from Redis
    await redis.del(`session:${userId}`);

    // Blacklist token
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.decode(token);
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      if (expiresIn > 0) {
        await redis.setEx(`blacklist:${token}`, expiresIn, 'true');
      }
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'logout',
        description: 'User logged out',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`User logged out: ${userId}`);

    res.json({ message: 'Logout successful' });

  } catch (error) {
    req.app.locals.logger.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to logout'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const { prisma, redis, logger } = req.app.locals;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { userId, sessionId } = decoded;

    // Check if session exists and is active
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: sessionId,
        userId: userId,
        isActive: true,
        refreshExpiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = jwt.sign({
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      sessionId
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    // Update session last accessed
    await prisma.session.update({
      where: { id: session.id },
      data: { lastAccessedAt: new Date() }
    });

    // Update Redis session
    await redis.setEx(`session:${userId}`, 3600, sessionId);

    logger.info(`Token refreshed for user: ${userId}`);

    res.json({
      accessToken: newAccessToken,
      refreshToken: refreshToken // Keep the same refresh token
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    req.app.locals.logger.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh token'
    });
  }
});

// Forgot password
router.post('/forgot-password', forgotPasswordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { email } = req.body;
    const { prisma, logger } = req.app.locals;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Always return success for security (don't reveal if email exists)
    if (!user) {
      return res.json({
        message: 'If an account with this email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiresAt: resetTokenExpiry
      }
    });

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken, `${user.firstName} ${user.lastName}`);
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to send password reset email'
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'password_reset_requested',
        description: 'Password reset requested',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      message: 'If an account with this email exists, a password reset link has been sent'
    });

  } catch (error) {
    req.app.locals.logger.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process password reset request'
    });
  }
});

// Reset password
router.post('/reset-password', resetPasswordValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { token, password } = req.body;
    const { prisma, redis, logger } = req.app.locals;

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiresAt: { gt: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });

    // Invalidate all user sessions
    await prisma.session.updateMany({
      where: { userId: user.id },
      data: {
        isActive: false,
        revokedAt: new Date()
      }
    });

    // Remove from Redis
    await redis.del(`session:${user.id}`);

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'password_reset_completed',
        description: 'Password reset completed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`Password reset completed for user: ${user.id}`);

    res.json({
      message: 'Password reset successful. Please login with your new password.'
    });

  } catch (error) {
    req.app.locals.logger.error('Reset password error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to reset password'
    });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    const { prisma, logger } = req.app.locals;

    if (!token) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Verification token is required'
      });
    }

    // Find user with verification token
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid verification token'
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email is already verified'
      });
    }

    // Verify email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
        status: 'ACTIVE'
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'email_verified',
        description: 'Email verified',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    logger.info(`Email verified for user: ${user.id}`);

    res.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    req.app.locals.logger.error('Email verification error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to verify email'
    });
  }
});

module.exports = router;