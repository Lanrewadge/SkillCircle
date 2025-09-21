const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

class SecurityManager {
  constructor(config = {}) {
    this.config = {
      encryption: {
        algorithm: 'aes-256-gcm',
        keyLength: 32,
        ivLength: 16,
        tagLength: 16,
        secretKey: config.encryptionKey || process.env.ENCRYPTION_KEY
      },
      rateLimit: {
        windowMs: config.rateLimitWindow || 15 * 60 * 1000, // 15 minutes
        max: config.rateLimitMax || 100,
        message: 'Too many requests from this IP'
      },
      security: {
        saltRounds: config.saltRounds || 12,
        jwtExpiresIn: config.jwtExpiresIn || '1h',
        refreshTokenExpiresIn: config.refreshTokenExpiresIn || '7d',
        passwordMinLength: config.passwordMinLength || 8,
        maxLoginAttempts: config.maxLoginAttempts || 5,
        lockoutTime: config.lockoutTime || 30 * 60 * 1000 // 30 minutes
      }
    };

    this.setupSecretKey();
  }

  // Setup encryption secret key
  setupSecretKey() {
    if (!this.config.encryption.secretKey) {
      this.config.encryption.secretKey = crypto.randomBytes(this.config.encryption.keyLength);
    } else if (typeof this.config.encryption.secretKey === 'string') {
      this.config.encryption.secretKey = Buffer.from(this.config.encryption.secretKey, 'hex');
    }
  }

  // Helmet security middleware
  getHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "wss:", "ws:"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "same-origin" }
    });
  }

  // Rate limiting middleware
  createRateLimiter(options = {}) {
    const config = { ...this.config.rateLimit, ...options };

    return rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      message: {
        error: 'Too Many Requests',
        message: config.message,
        retryAfter: Math.ceil(config.windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        res.status(429).json({
          error: 'Too Many Requests',
          message: config.message,
          retryAfter: Math.ceil(config.windowMs / 1000)
        });
      }
    });
  }

  // Specialized rate limiters
  getAuthRateLimiter() {
    return this.createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 attempts per window
      message: 'Too many authentication attempts'
    });
  }

  getPasswordResetLimiter() {
    return this.createRateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 password reset attempts per hour
      message: 'Too many password reset attempts'
    });
  }

  // Data encryption/decryption
  encrypt(text) {
    try {
      const iv = crypto.randomBytes(this.config.encryption.ivLength);
      const cipher = crypto.createCipher(this.config.encryption.algorithm, this.config.encryption.secretKey, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      throw new Error('Encryption failed: ' + error.message);
    }
  }

  decrypt(encryptedData) {
    try {
      const { encrypted, iv, tag } = encryptedData;

      const decipher = crypto.createDecipher(
        this.config.encryption.algorithm,
        this.config.encryption.secretKey,
        Buffer.from(iv, 'hex')
      );

      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }

  // Password hashing and verification
  async hashPassword(password) {
    if (!this.validatePassword(password)) {
      throw new Error('Password does not meet security requirements');
    }

    return await bcrypt.hash(password, this.config.security.saltRounds);
  }

  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Password validation
  validatePassword(password) {
    const minLength = this.config.security.passwordMinLength;

    return (
      password &&
      password.length >= minLength &&
      /[A-Z]/.test(password) && // At least one uppercase letter
      /[a-z]/.test(password) && // At least one lowercase letter
      /\d/.test(password) && // At least one digit
      /[!@#$%^&*(),.?":{}|<>]/.test(password) // At least one special character
    );
  }

  // Input sanitization
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') {
      return input;
    }

    let sanitized = input;

    // Trim whitespace
    if (options.trim !== false) {
      sanitized = sanitized.trim();
    }

    // Escape HTML
    if (options.escapeHtml !== false) {
      sanitized = validator.escape(sanitized);
    }

    // Remove SQL injection patterns
    if (options.preventSqlInjection !== false) {
      sanitized = sanitized.replace(/('|(\\)|;|--|\/\*|\*\/)/g, '');
    }

    // Remove XSS patterns
    if (options.preventXss !== false) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }

    return sanitized;
  }

  // Input validation middleware
  createValidator(schema) {
    return (req, res, next) => {
      const errors = [];

      Object.keys(schema).forEach(field => {
        const rules = schema[field];
        const value = req.body[field];

        // Required field validation
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push({
            field,
            message: `${field} is required`
          });
          return;
        }

        if (value !== undefined && value !== null) {
          // Type validation
          if (rules.type && typeof value !== rules.type) {
            errors.push({
              field,
              message: `${field} must be of type ${rules.type}`
            });
          }

          // Email validation
          if (rules.email && !validator.isEmail(value)) {
            errors.push({
              field,
              message: `${field} must be a valid email address`
            });
          }

          // URL validation
          if (rules.url && !validator.isURL(value)) {
            errors.push({
              field,
              message: `${field} must be a valid URL`
            });
          }

          // Length validation
          if (rules.minLength && value.length < rules.minLength) {
            errors.push({
              field,
              message: `${field} must be at least ${rules.minLength} characters long`
            });
          }

          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push({
              field,
              message: `${field} must be no more than ${rules.maxLength} characters long`
            });
          }

          // Custom validation
          if (rules.custom && typeof rules.custom === 'function') {
            const customResult = rules.custom(value);
            if (customResult !== true) {
              errors.push({
                field,
                message: customResult || `${field} is invalid`
              });
            }
          }

          // Sanitize input
          if (rules.sanitize !== false) {
            req.body[field] = this.sanitizeInput(value, rules.sanitizeOptions);
          }
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid input data',
          details: errors
        });
      }

      next();
    };
  }

  // Two-Factor Authentication
  generateTwoFactorSecret(label) {
    return speakeasy.generateSecret({
      name: label,
      issuer: 'Skill Circle',
      length: 32
    });
  }

  async generateQRCode(secret, label) {
    const otpauthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: label,
      issuer: 'Skill Circle',
      encoding: 'base32'
    });

    return await qrcode.toDataURL(otpauthUrl);
  }

  verifyTwoFactorToken(token, secret) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps (60 seconds) tolerance
    });
  }

  // Generate backup codes
  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  // API Key generation and validation
  generateApiKey() {
    const key = crypto.randomBytes(32).toString('hex');
    const prefix = 'sk_';
    return prefix + key;
  }

  validateApiKey(apiKey) {
    return (
      typeof apiKey === 'string' &&
      apiKey.startsWith('sk_') &&
      apiKey.length === 67 // 3 (prefix) + 64 (hex string)
    );
  }

  // CSRF Token generation
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Session token generation
  generateSessionToken() {
    return crypto.randomBytes(48).toString('base64url');
  }

  // Secure random string generation
  generateSecureRandom(length = 32, encoding = 'hex') {
    return crypto.randomBytes(length).toString(encoding);
  }

  // IP address validation and rate limiting
  isPrivateIP(ip) {
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2\d|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];

    return privateRanges.some(range => range.test(ip));
  }

  // Audit logging
  createAuditLog(action, userId, details = {}) {
    return {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      ip: details.ip,
      userAgent: details.userAgent,
      sessionId: details.sessionId
    };
  }

  // Security headers middleware
  securityHeaders() {
    return (req, res, next) => {
      // Remove server information
      res.removeHeader('X-Powered-By');

      // Add security headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

      next();
    };
  }

  // Timing attack prevention
  async constantTimeCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    // Add artificial delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 50));

    return result === 0;
  }
}

module.exports = SecurityManager;