const consul = require('consul');

class ServiceRegistry {
  constructor() {
    this.consul = consul({
      host: process.env.CONSUL_HOST || 'localhost',
      port: process.env.CONSUL_PORT || 8500,
      promisify: true
    });

    this.services = new Map(); // Fallback in-memory registry
  }

  async register(serviceName, address, port, health = {}) {
    const serviceId = `${serviceName}-${address}-${port}`;

    const serviceConfig = {
      id: serviceId,
      name: serviceName,
      address: address,
      port: port,
      tags: [`env:${process.env.NODE_ENV || 'development'}`],
      check: {
        http: `http://${address}:${port}/health`,
        interval: '30s',
        timeout: '10s',
        deregistercriticalserviceafter: '1m',
        ...health
      }
    };

    try {
      // Try to register with Consul
      await this.consul.agent.service.register(serviceConfig);
      console.log(`Service ${serviceName} registered with Consul at ${address}:${port}`);
    } catch (error) {
      console.warn(`Failed to register with Consul, using fallback registry:`, error.message);

      // Fallback to in-memory registry
      if (!this.services.has(serviceName)) {
        this.services.set(serviceName, []);
      }

      const serviceList = this.services.get(serviceName);
      const existingIndex = serviceList.findIndex(s => s.id === serviceId);

      if (existingIndex !== -1) {
        serviceList[existingIndex] = { id: serviceId, address, port, lastSeen: Date.now() };
      } else {
        serviceList.push({ id: serviceId, address, port, lastSeen: Date.now() });
      }
    }
  }

  async deregister(serviceName, address, port) {
    const serviceId = `${serviceName}-${address}-${port}`;

    try {
      await this.consul.agent.service.deregister(serviceId);
      console.log(`Service ${serviceName} deregistered from Consul`);
    } catch (error) {
      console.warn(`Failed to deregister from Consul:`, error.message);

      // Fallback to in-memory registry
      if (this.services.has(serviceName)) {
        const serviceList = this.services.get(serviceName);
        const filteredList = serviceList.filter(s => s.id !== serviceId);
        this.services.set(serviceName, filteredList);
      }
    }
  }

  async getServices(serviceName) {
    try {
      // Try to get from Consul
      const services = await this.consul.health.service({
        service: serviceName,
        passing: true
      });

      return services.map(service => ({
        id: service.Service.ID,
        address: service.Service.Address,
        port: service.Service.Port,
        tags: service.Service.Tags
      }));
    } catch (error) {
      console.warn(`Failed to get services from Consul:`, error.message);

      // Fallback to in-memory registry
      const services = this.services.get(serviceName) || [];
      const now = Date.now();
      const fiveMinutesAgo = now - (5 * 60 * 1000);

      // Filter out stale services (older than 5 minutes)
      const activeServices = services.filter(s => s.lastSeen > fiveMinutesAgo);
      this.services.set(serviceName, activeServices);

      return activeServices;
    }
  }

  async getAllServices() {
    try {
      const catalog = await this.consul.catalog.service.list();
      return catalog;
    } catch (error) {
      console.warn(`Failed to get all services from Consul:`, error.message);

      // Return in-memory registry
      const allServices = {};
      for (const [serviceName, serviceList] of this.services.entries()) {
        allServices[serviceName] = serviceList.length;
      }
      return allServices;
    }
  }

  // Health check for services
  async healthCheck(serviceName) {
    const services = await this.getServices(serviceName);
    const healthResults = [];

    for (const service of services) {
      try {
        const response = await fetch(`http://${service.address}:${service.port}/health`, {
          method: 'GET',
          timeout: 5000
        });

        healthResults.push({
          service: serviceName,
          instance: `${service.address}:${service.port}`,
          status: response.ok ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        healthResults.push({
          service: serviceName,
          instance: `${service.address}:${service.port}`,
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    return healthResults;
  }

  // Simple load balancing - round robin
  async getNextService(serviceName) {
    const services = await this.getServices(serviceName);

    if (services.length === 0) {
      throw new Error(`No healthy instances of ${serviceName} available`);
    }

    // Simple round-robin (in production, you'd want more sophisticated algorithms)
    const randomIndex = Math.floor(Math.random() * services.length);
    return services[randomIndex];
  }
}

module.exports = new ServiceRegistry();