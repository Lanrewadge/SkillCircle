require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const redis = require('redis');
const winston = require('winston');
const consul = require('consul');

// Import routes
const skillRoutes = require('./routes/skills');
const categoryRoutes = require('./routes/categories');
const roadmapRoutes = require('./routes/roadmaps');
const searchRoutes = require('./routes/search');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize services
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
    new winston.transports.File({ filename: 'logs/skills-service.log' })
  ]
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill-circle-skills', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  logger.info('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
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
  max: 200, // Limit each IP to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Request logging
app.use(requestLogger(logger));

// Make services available to routes
app.locals.redis = redisClient;
app.locals.logger = logger;

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    await mongoose.connection.db.admin().ping();

    // Check Redis connection
    await redisClient.ping();

    res.status(200).json({
      status: 'healthy',
      service: 'skills-service',
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
      service: 'skills-service',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Public routes (no authentication required)
app.use('/public/skills', skillRoutes);
app.use('/public/categories', categoryRoutes);
app.use('/public/search', searchRoutes);

// Protected routes (authentication required)
app.use('/skills', authMiddleware, skillRoutes);
app.use('/categories', authMiddleware, categoryRoutes);
app.use('/roadmaps', authMiddleware, roadmapRoutes);
app.use('/search', authMiddleware, searchRoutes);

// Service info endpoint
app.get('/info', (req, res) => {
  res.json({
    service: 'skills-service',
    version: process.env.npm_package_version || '1.0.0',
    description: 'Skills Management and Catalog Service',
    endpoints: [
      'GET /skills',
      'GET /skills/:id',
      'POST /skills',
      'PUT /skills/:id',
      'DELETE /skills/:id',
      'GET /categories',
      'GET /categories/:category/skills',
      'GET /roadmaps',
      'GET /roadmaps/:id',
      'POST /roadmaps',
      'GET /search',
      'GET /search/suggestions'
    ],
    features: [
      'Skill catalog management',
      'Category-based organization',
      'Learning roadmaps',
      'Full-text search',
      'Prerequisites tracking',
      'Skill analytics'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    service: 'skills-service'
  });
});

// Global error handler
app.use(errorHandler(logger));

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  try {
    // Deregister from service discovery
    await consulClient.agent.service.deregister('skills-service');

    // Close database connections
    await mongoose.connection.close();

    // Close Redis connection
    await redisClient.quit();

    logger.info('Skills service shut down gracefully');
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
  logger.info(`Skills service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Register with service discovery
  try {
    await consulClient.agent.service.register({
      id: `skills-service-${process.env.HOSTNAME || 'localhost'}-${PORT}`,
      name: 'skills-service',
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
    logger.info('Skills service registered with Consul');
  } catch (error) {
    logger.warn('Failed to register with Consul:', error.message);
  }
});

module.exports = app;