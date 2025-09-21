require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const redis = require('redis');
const winston = require('winston');
const consul = require('consul');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const preferencesRoutes = require('./routes/preferences');
const sessionRoutes = require('./routes/session');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize services
const prisma = new PrismaClient();
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

const consulClient = consul({
  host: process.env.CONSUL_HOST || 'localhost',
  port: process.env.CONSUL_PORT || 8500
});

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/user-service.log' })
  ]
});

// Connect Redis
redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.connect();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Request logging
app.use(requestLogger(logger));

// Make services available to routes
app.locals.prisma = prisma;
app.locals.redis = redisClient;
app.locals.logger = logger;

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    await redisClient.ping();

    res.status(200).json({
      status: 'healthy',
      service: 'user-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      cache: 'connected'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      service: 'user-service',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/preferences', authMiddleware, preferencesRoutes);
app.use('/sessions', authMiddleware, sessionRoutes);

// Service info endpoint
app.get('/info', (req, res) => {
  res.json({
    service: 'user-service',
    version: process.env.npm_package_version || '1.0.0',
    description: 'User Authentication and Profile Management Service',
    endpoints: [
      'POST /auth/register',
      'POST /auth/login',
      'POST /auth/logout',
      'POST /auth/refresh',
      'POST /auth/forgot-password',
      'POST /auth/reset-password',
      'POST /auth/verify-email',
      'GET /users/profile',
      'PUT /users/profile',
      'DELETE /users/account',
      'GET /preferences',
      'PUT /preferences',
      'GET /sessions',
      'DELETE /sessions/:sessionId'
    ],
    documentation: '/docs'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    service: 'user-service'
  });
});

// Global error handler
app.use(errorHandler(logger));

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  try {
    // Deregister from service discovery
    await consulClient.agent.service.deregister('user-service');

    // Close database connections
    await prisma.$disconnect();

    // Close Redis connection
    await redisClient.quit();

    logger.info('User service shut down gracefully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
app.listen(PORT, async () => {
  logger.info(`User service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Register with service discovery
  try {
    await consulClient.agent.service.register({
      id: `user-service-${process.env.HOSTNAME || 'localhost'}-${PORT}`,
      name: 'user-service',
      address: process.env.SERVICE_HOST || 'localhost',
      port: PORT,
      tags: [`env:${process.env.NODE_ENV || 'development'}`],
      check: {
        http: `http://${process.env.SERVICE_HOST || 'localhost'}:${PORT}/health`,
        interval: '30s',
        timeout: '10s',
        deregistercriticalserviceafter: '1m'
      }
    });
    logger.info('User service registered with Consul');
  } catch (error) {
    logger.warn('Failed to register with Consul:', error.message);
  }
});

module.exports = app;