require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const winston = require('winston');

const serviceRegistry = require('./serviceRegistry');
const authMiddleware = require('./middleware/auth');
const loggingMiddleware = require('./middleware/logging');
const healthCheck = require('./middleware/healthCheck');

const app = express();
const PORT = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/gateway.log' })
  ]
});

// Redis client for caching and session management
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.connect();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
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

// Custom middleware
app.use(loggingMiddleware(logger));

// Health check endpoint
app.get('/health', healthCheck);

// API Gateway routes configuration
const services = {
  user: {
    target: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    timeout: 30000,
    retries: 3
  },
  skills: {
    target: process.env.SKILLS_SERVICE_URL || 'http://localhost:3002',
    changeOrigin: true,
    timeout: 30000,
    retries: 3
  },
  learning: {
    target: process.env.LEARNING_SERVICE_URL || 'http://localhost:3003',
    changeOrigin: true,
    timeout: 30000,
    retries: 3
  },
  content: {
    target: process.env.CONTENT_SERVICE_URL || 'http://localhost:3004',
    changeOrigin: true,
    timeout: 30000,
    retries: 3
  },
  visualization: {
    target: process.env.VISUALIZATION_SERVICE_URL || 'http://localhost:3005',
    changeOrigin: true,
    timeout: 30000,
    retries: 3
  },
  notification: {
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
    changeOrigin: true,
    timeout: 30000,
    retries: 3
  }
};

// Service discovery and load balancing
const getServiceUrl = async (serviceName) => {
  // Try to get from service registry first
  const registeredServices = await serviceRegistry.getServices(serviceName);
  if (registeredServices.length > 0) {
    // Simple round-robin load balancing
    const service = registeredServices[Math.floor(Math.random() * registeredServices.length)];
    return `http://${service.address}:${service.port}`;
  }

  // Fallback to static configuration
  return services[serviceName]?.target;
};

// Enhanced proxy middleware with circuit breaker pattern
const createEnhancedProxy = (serviceName, requireAuth = true) => {
  return async (req, res, next) => {
    try {
      const targetUrl = await getServiceUrl(serviceName);

      if (!targetUrl) {
        return res.status(503).json({
          error: 'Service Unavailable',
          message: `${serviceName} service is not available`,
          service: serviceName
        });
      }

      const proxyOptions = {
        target: targetUrl,
        changeOrigin: true,
        timeout: 30000,
        pathRewrite: {
          [`^/api/${serviceName}`]: '/'
        },
        onError: (err, req, res) => {
          logger.error(`Proxy error for ${serviceName}:`, err);
          res.status(502).json({
            error: 'Bad Gateway',
            message: `Error communicating with ${serviceName} service`,
            service: serviceName
          });
        },
        onProxyReq: (proxyReq, req, res) => {
          // Add correlation ID for tracing
          const correlationId = req.headers['x-correlation-id'] ||
                               require('crypto').randomUUID();
          proxyReq.setHeader('x-correlation-id', correlationId);
          proxyReq.setHeader('x-gateway-forwarded', 'true');

          logger.info(`Proxying request to ${serviceName}`, {
            method: req.method,
            path: req.path,
            correlationId,
            service: serviceName
          });
        }
      };

      // Apply authentication middleware if required
      if (requireAuth) {
        authMiddleware(req, res, (err) => {
          if (err) return next(err);
          createProxyMiddleware(proxyOptions)(req, res, next);
        });
      } else {
        createProxyMiddleware(proxyOptions)(req, res, next);
      }
    } catch (error) {
      logger.error(`Error setting up proxy for ${serviceName}:`, error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to route request',
        service: serviceName
      });
    }
  };
};

// Public routes (no authentication required)
app.use('/api/user/register', createEnhancedProxy('user', false));
app.use('/api/user/login', createEnhancedProxy('user', false));
app.use('/api/user/forgot-password', createEnhancedProxy('user', false));
app.use('/api/user/reset-password', createEnhancedProxy('user', false));
app.use('/api/skills/public', createEnhancedProxy('skills', false));
app.use('/api/content/public', createEnhancedProxy('content', false));

// Protected routes (authentication required)
app.use('/api/user', createEnhancedProxy('user', true));
app.use('/api/skills', createEnhancedProxy('skills', true));
app.use('/api/learning', createEnhancedProxy('learning', true));
app.use('/api/content', createEnhancedProxy('content', true));
app.use('/api/visualization', createEnhancedProxy('visualization', true));
app.use('/api/notification', createEnhancedProxy('notification', true));

// WebSocket proxy for real-time features
const { createProxyMiddleware: createWSProxy } = require('http-proxy-middleware');

const wsProxy = createWSProxy('/ws', {
  target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
  ws: true,
  changeOrigin: true,
  onError: (err, req, socket, head) => {
    logger.error('WebSocket proxy error:', err);
  }
});

app.use('/ws', wsProxy);

// Service status endpoint
app.get('/api/status', async (req, res) => {
  const serviceStatuses = {};

  for (const [serviceName, config] of Object.entries(services)) {
    try {
      const targetUrl = await getServiceUrl(serviceName);
      const response = await fetch(`${targetUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      serviceStatuses[serviceName] = {
        status: response.ok ? 'healthy' : 'unhealthy',
        url: targetUrl,
        lastChecked: new Date().toISOString()
      };
    } catch (error) {
      serviceStatuses[serviceName] = {
        status: 'unhealthy',
        error: error.message,
        lastChecked: new Date().toISOString()
      };
    }
  }

  res.json({
    gateway: 'healthy',
    timestamp: new Date().toISOString(),
    services: serviceStatuses
  });
});

// Fallback route
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Gateway error:', err);

  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');

  await redisClient.quit();

  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info('Service routes configured:', Object.keys(services));

  // Register gateway with service discovery
  serviceRegistry.register('api-gateway', 'localhost', PORT);
});

module.exports = app;