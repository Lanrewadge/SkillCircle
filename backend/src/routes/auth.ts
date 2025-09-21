import { Router } from 'express';
import { body, validationResult } from 'express-validator';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { emailService, generateVerificationCode, generateResetToken } from '../utils/emailService';

const router = Router();
const prisma = new PrismaClient();

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: Date }>();

// Helper function to clean expired codes
const cleanExpiredCodes = () => {
  const now = new Date();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(email);
    }
  }
};

// Send email verification code
router.post('/send-verification', [
  body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Invalid email address');
    }

    const { email } = req.body;

    // Clean expired codes
    cleanExpiredCodes();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw createError(409, 'User with this email already exists');
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code
    verificationCodes.set(email, { code, expiresAt });

    // Send email
    await emailService.sendVerificationEmail(email, code);

    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });
  } catch (error) {
    next(error);
  }
});

// Verify email code
router.post('/verify-email', [
  body('email').isEmail().normalizeEmail(),
  body('code').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Invalid email or verification code');
    }

    const { email, code } = req.body;

    // Clean expired codes
    cleanExpiredCodes();

    // Check if code exists and is valid
    const storedData = verificationCodes.get(email);
    if (!storedData) {
      throw createError(400, 'Verification code not found or expired');
    }

    if (storedData.code !== code) {
      throw createError(400, 'Invalid verification code');
    }

    // Remove used code
    verificationCodes.delete(email);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 30 }).trim(),
  body('firstName').isLength({ min: 1, max: 50 }).trim(),
  body('lastName').isLength({ min: 1, max: 50 }).trim(),
  body('password').isLength({ min: 6 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Validation failed', errors.array());
    }

    const { email, username, firstName, lastName, password, location, latitude, longitude } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      throw createError(409, 'User with this email or username already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: `${firstName} ${lastName}`,
        password: hashedPassword,
        latitude: latitude || 40.7128,
        longitude: longitude || -74.0060,
        address: location || 'New York, NY',
        city: location?.split(',')[0] || 'New York',
        country: location?.split(',').pop()?.trim() || 'USA',
        profile: {
          create: {}
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        verified: true,
        isTeacher: true,
        isLearner: true,
        createdAt: true
      }
    });

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw createError(500, 'JWT secret not configured');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        password: true,
        avatar: true,
        verified: true,
        isTeacher: true,
        isLearner: true,
        createdAt: true
      }
    });

    if (!user) {
      throw createError(401, 'Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw createError(401, 'Invalid credentials');
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      throw createError(500, 'JWT secret not configured');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar: true,
        bio: true,
        verified: true,
        isTeacher: true,
        isLearner: true,
        rating: true,
        reviewCount: true,
        latitude: true,
        longitude: true,
        address: true,
        city: true,
        country: true,
        createdAt: true,
        profile: true
      }
    });

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Forgot password - send reset email
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Invalid email address');
    }

    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        success: true,
        message: 'If an account with this email exists, we\'ve sent a password reset link'
      });
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // TODO: Store reset token in database
    // For now, we'll store it in memory (not production-ready)
    verificationCodes.set(`reset_${email}`, { code: resetToken, expiresAt });

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'If an account with this email exists, we\'ve sent a password reset link'
    });
  } catch (error) {
    next(error);
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(400, 'Invalid token or password');
    }

    const { token, password } = req.body;

    // Clean expired codes
    cleanExpiredCodes();

    // Find the email associated with this token
    let userEmail = '';
    for (const [key, data] of verificationCodes.entries()) {
      if (key.startsWith('reset_') && data.code === token) {
        userEmail = key.replace('reset_', '');
        break;
      }
    }

    if (!userEmail) {
      throw createError(400, 'Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword }
    });

    // Remove reset token
    verificationCodes.delete(`reset_${userEmail}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;