const cluster = require('cluster');
const os = require('os');
const compression = require('compression');
const helmet = require('helmet');

class PerformanceOptimizer {
  constructor(config = {}) {
    this.config = {
      clustering: {
        enabled: config.clustering !== false,
        workers: config.workers || os.cpus().length,
        restartOnExit: config.restartOnExit !== false
      },
      compression: {
        enabled: config.compression !== false,
        level: config.compressionLevel || 6,
        threshold: config.compressionThreshold || 1024
      },
      caching: {
        enabled: config.caching !== false,
        maxAge: config.cacheMaxAge || 86400000, // 1 day
        immutable: config.immutable || false
      },
      keepAlive: {
        enabled: config.keepAlive !== false,
        timeout: config.keepAliveTimeout || 65000,
        maxSockets: config.maxSockets || Infinity
      },
      memory: {
        gc: config.gc !== false,
        gcInterval: config.gcInterval || 300000, // 5 minutes
        heapLimit: config.heapLimit || 0.8 // 80% of max heap
      }
    };

    this.metrics = {
      requests: 0,
      responses: 0,
      errors: 0,
      responseTime: {
        total: 0,
        count: 0,
        avg: 0,
        min: Infinity,
        max: 0
      }
    };
  }

  // Initialize clustering
  setupClustering(serverFunction) {
    if (!this.config.clustering.enabled) {
      return serverFunction();
    }

    if (cluster.isMaster) {
      console.log(`Master ${process.pid} is running`);

      // Fork workers
      for (let i = 0; i < this.config.clustering.workers; i++) {
        cluster.fork();
      }

      // Handle worker exit
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);

        if (this.config.clustering.restartOnExit) {
          console.log('Starting a new worker');
          cluster.fork();
        }
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        console.log('Master received SIGTERM, shutting down workers');
        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }
      });

    } else {
      console.log(`Worker ${process.pid} started`);
      return serverFunction();
    }
  }

  // Response compression middleware
  getCompressionMiddleware() {
    if (!this.config.compression.enabled) {
      return (req, res, next) => next();
    }

    return compression({
      level: this.config.compression.level,
      threshold: this.config.compression.threshold,
      filter: (req, res) => {
        // Don't compress if client doesn't support it
        if (!req.headers['accept-encoding']) {
          return false;
        }

        // Don't compress already compressed content
        if (res.getHeader('content-encoding')) {
          return false;
        }

        // Compress JSON and text content
        const contentType = res.getHeader('content-type');
        if (contentType) {
          return /json|text|javascript|css|xml/.test(contentType);
        }

        return compression.filter(req, res);
      }
    });
  }

  // Static file caching
  getCachingMiddleware() {
    if (!this.config.caching.enabled) {
      return (req, res, next) => next();
    }

    return (req, res, next) => {
      // Set cache headers for static assets
      if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        res.set({
          'Cache-Control': `public, max-age=${this.config.caching.maxAge}${this.config.caching.immutable ? ', immutable' : ''}`,
          'Expires': new Date(Date.now() + this.config.caching.maxAge).toUTCString()
        });
      } else {
        // No cache for dynamic content
        res.set({
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
      }

      next();
    };
  }

  // Keep-alive configuration
  setupKeepAlive(server) {
    if (!this.config.keepAlive.enabled) {
      return;
    }

    server.keepAliveTimeout = this.config.keepAlive.timeout;
    server.headersTimeout = this.config.keepAlive.timeout + 1000;
    server.maxConnections = this.config.keepAlive.maxSockets;

    console.log(`Keep-alive configured: timeout=${this.config.keepAlive.timeout}ms`);
  }

  // Memory optimization
  setupMemoryOptimization() {
    if (!this.config.memory.gc) {
      return;
    }

    // Periodic garbage collection
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
      const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
      const heapUtilization = heapUsedMB / heapTotalMB;

      console.log(`Memory usage: ${heapUsedMB.toFixed(2)}MB / ${heapTotalMB.toFixed(2)}MB (${(heapUtilization * 100).toFixed(2)}%)`);

      // Force GC if heap utilization is high
      if (heapUtilization > this.config.memory.heapLimit && global.gc) {
        console.log('Forcing garbage collection');
        global.gc();
      }
    }, this.config.memory.gcInterval);

    // Monitor for memory leaks
    let baseline = process.memoryUsage().heapUsed;

    setInterval(() => {
      const current = process.memoryUsage().heapUsed;
      const growth = ((current - baseline) / baseline) * 100;

      if (growth > 50) { // 50% growth
        console.warn(`Potential memory leak detected: ${growth.toFixed(2)}% growth`);
      }

      baseline = current;
    }, 60000); // Check every minute
  }

  // Request/Response monitoring
  getMetricsMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      this.metrics.requests++;

      // Monitor response
      const originalSend = res.send;
      res.send = function(data) {
        const responseTime = Date.now() - startTime;

        // Update metrics
        this.metrics.responses++;
        this.metrics.responseTime.total += responseTime;
        this.metrics.responseTime.count++;
        this.metrics.responseTime.avg = this.metrics.responseTime.total / this.metrics.responseTime.count;
        this.metrics.responseTime.min = Math.min(this.metrics.responseTime.min, responseTime);
        this.metrics.responseTime.max = Math.max(this.metrics.responseTime.max, responseTime);

        // Log slow requests
        if (responseTime > 1000) {
          console.warn(`Slow request: ${req.method} ${req.url} - ${responseTime}ms`);
        }

        return originalSend.call(this, data);
      }.bind(this);

      // Monitor errors
      res.on('error', () => {
        this.metrics.errors++;
      });

      next();
    };
  }

  // Database connection pooling
  optimizeDatabaseConnections(dbConfig) {
    return {
      ...dbConfig,
      // Connection pooling
      max: dbConfig.max || 20, // Maximum connections
      min: dbConfig.min || 2,  // Minimum connections
      idle: dbConfig.idle || 10000, // Idle timeout
      acquire: dbConfig.acquire || 60000, // Acquire timeout

      // Query optimization
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      benchmark: process.env.NODE_ENV === 'development',

      // Retry logic
      retry: {
        max: 3,
        timeout: 30000
      },

      // Connection validation
      validate: true,

      // Timezone
      timezone: '+00:00'
    };
  }

  // Redis connection optimization
  optimizeRedisConnections(redisConfig) {
    return {
      ...redisConfig,

      // Connection settings
      connectTimeout: redisConfig.connectTimeout || 60000,
      commandTimeout: redisConfig.commandTimeout || 5000,
      retryDelayOnFailover: redisConfig.retryDelayOnFailover || 100,
      maxRetriesPerRequest: redisConfig.maxRetriesPerRequest || 3,

      // Keepalive
      keepAlive: redisConfig.keepAlive !== false,

      // Connection pooling
      lazyConnect: true,
      maxLoadingTimeout: 5000,

      // Auto-pipeline
      enableAutoPipelining: true,

      // Retry settings
      retryBackoff: {
        initial: 100,
        randomness: 0.1
      }
    };
  }

  // HTTP client optimization
  optimizeHttpClient() {
    const https = require('https');
    const http = require('http');

    // Create optimized agents
    const httpsAgent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      freeSocketTimeout: 30000
    });

    const httpAgent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 60000,
      freeSocketTimeout: 30000
    });

    return { httpsAgent, httpAgent };
  }

  // Response optimization
  optimizeResponse(app) {
    // Remove unnecessary headers
    app.disable('x-powered-by');

    // ETags for caching
    app.set('etag', 'strong');

    // Trust proxy for accurate client IPs
    app.set('trust proxy', true);

    // JSON optimization
    app.set('json spaces', 0); // Minify JSON
    app.set('json replacer', null);

    return app;
  }

  // Get performance metrics
  getMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      ...this.metrics,
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        rss: Math.round(memUsage.rss / 1024 / 1024) // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: process.uptime(),
      pid: process.pid,
      nodeVersion: process.version
    };
  }

  // Load balancer health check
  healthCheck() {
    const metrics = this.getMetrics();

    // Determine health based on metrics
    const isHealthy = (
      metrics.memory.heapUsed < (metrics.memory.heapTotal * 0.9) && // < 90% heap usage
      metrics.responseTime.avg < 2000 && // < 2s average response time
      (metrics.errors / metrics.responses) < 0.05 // < 5% error rate
    );

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      metrics
    };
  }

  // Graceful shutdown
  setupGracefulShutdown(server, cleanup = async () => {}) {
    const signals = ['SIGTERM', 'SIGINT'];

    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, starting graceful shutdown`);

        // Stop accepting new connections
        server.close(async () => {
          console.log('HTTP server closed');

          try {
            // Custom cleanup
            await cleanup();
            console.log('Cleanup completed');
            process.exit(0);
          } catch (error) {
            console.error('Error during cleanup:', error);
            process.exit(1);
          }
        });

        // Force shutdown after timeout
        setTimeout(() => {
          console.error('Forced shutdown due to timeout');
          process.exit(1);
        }, 30000); // 30 second timeout
      });
    });
  }

  // Production optimizations
  setupProductionOptimizations(app) {
    if (process.env.NODE_ENV !== 'production') {
      return app;
    }

    // Disable detailed error messages
    app.set('env', 'production');

    // Security headers
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));

    // Disable detailed stack traces
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        error: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
    });

    return app;
  }
}

module.exports = PerformanceOptimizer;