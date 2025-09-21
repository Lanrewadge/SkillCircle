const { v4: uuidv4 } = require('uuid');

const loggingMiddleware = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();
    const correlationId = req.headers['x-correlation-id'] || uuidv4();

    // Add correlation ID to request headers
    req.headers['x-correlation-id'] = correlationId;

    // Log incoming request
    logger.info('Incoming request', {
      correlationId,
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function(data) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      logger.info('Outgoing response', {
        correlationId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });

      return originalJson.call(this, data);
    };

    // Add correlation ID to response headers
    res.set('x-correlation-id', correlationId);

    next();
  };
};

module.exports = loggingMiddleware;