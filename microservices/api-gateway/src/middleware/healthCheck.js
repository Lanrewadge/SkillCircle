const healthCheck = (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'API Gateway is healthy',
    timestamp: new Date().toISOString(),
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    },
    cpu: {
      user: process.cpuUsage().user,
      system: process.cpuUsage().system
    }
  };

  try {
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'API Gateway is unhealthy';
    healthcheck.status = 'unhealthy';
    healthcheck.error = error.message;
    res.status(503).json(healthcheck);
  }
};

module.exports = healthCheck;