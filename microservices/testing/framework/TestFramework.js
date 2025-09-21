const { MongoMemoryServer } = require('mongodb-memory-server');
const { Client } = require('pg');
const redis = require('redis');
const request = require('supertest');
const jwt = require('jsonwebtoken');

class TestFramework {
  constructor() {
    this.mongoServer = null;
    this.postgresClient = null;
    this.redisClient = null;
    this.testUser = null;
    this.authToken = null;
    this.services = new Map();
  }

  // Setup test environment
  async setup() {
    await this.setupMongoDB();
    await this.setupPostgreSQL();
    await this.setupRedis();
    await this.createTestUser();
  }

  // Teardown test environment
  async teardown() {
    if (this.mongoServer) {
      await this.mongoServer.stop();
    }

    if (this.postgresClient) {
      await this.postgresClient.end();
    }

    if (this.redisClient) {
      await this.redisClient.quit();
    }

    this.services.clear();
  }

  // MongoDB setup
  async setupMongoDB() {
    this.mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'skill_circle_test'
      }
    });

    const uri = this.mongoServer.getUri();
    process.env.MONGODB_URI = uri;

    console.log(`Test MongoDB started: ${uri}`);
  }

  // PostgreSQL setup
  async setupPostgreSQL() {
    const testDbConfig = {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: 'skill_circle_test'
    };

    this.postgresClient = new Client(testDbConfig);
    await this.postgresClient.connect();

    // Create test database if it doesn't exist
    try {
      await this.postgresClient.query('CREATE DATABASE skill_circle_test_users');
      await this.postgresClient.query('CREATE DATABASE skill_circle_test_learning');
    } catch (error) {
      // Database might already exist
    }

    process.env.DATABASE_URL_USERS = `postgresql://${testDbConfig.user}:${testDbConfig.password}@${testDbConfig.host}:${testDbConfig.port}/skill_circle_test_users`;
    process.env.DATABASE_URL_LEARNING = `postgresql://${testDbConfig.user}:${testDbConfig.password}@${testDbConfig.host}:${testDbConfig.port}/skill_circle_test_learning`;

    console.log('Test PostgreSQL setup complete');
  }

  // Redis setup
  async setupRedis() {
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      db: 15 // Use separate DB for tests
    });

    await this.redisClient.connect();
    await this.redisClient.flushDb(); // Clear test database

    console.log('Test Redis setup complete');
  }

  // Create test user and auth token
  async createTestUser() {
    this.testUser = {
      id: 'test-user-id',
      email: 'test@skillcircle.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT'
    };

    this.authToken = jwt.sign(
      this.testUser,
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );

    console.log('Test user created');
  }

  // Service registration
  registerService(name, app) {
    this.services.set(name, app);
    console.log(`Service registered: ${name}`);
  }

  // Get service for testing
  getService(name) {
    return this.services.get(name);
  }

  // Authentication helpers
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'
    };
  }

  // Database helpers
  async cleanDatabase() {
    // Clean MongoDB
    if (this.mongoServer) {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
          await collection.deleteMany({});
        }
      }
    }

    // Clean PostgreSQL
    if (this.postgresClient) {
      // Add table cleanup queries as needed
    }

    // Clean Redis
    if (this.redisClient) {
      await this.redisClient.flushDb();
    }
  }

  // HTTP request helpers
  async get(service, path, options = {}) {
    const app = this.getService(service);
    if (!app) {
      throw new Error(`Service ${service} not registered`);
    }

    let req = request(app).get(path);

    if (options.auth) {
      req = req.set(this.getAuthHeaders());
    }

    if (options.headers) {
      req = req.set(options.headers);
    }

    return req;
  }

  async post(service, path, data = {}, options = {}) {
    const app = this.getService(service);
    if (!app) {
      throw new Error(`Service ${service} not registered`);
    }

    let req = request(app).post(path).send(data);

    if (options.auth) {
      req = req.set(this.getAuthHeaders());
    }

    if (options.headers) {
      req = req.set(options.headers);
    }

    return req;
  }

  async put(service, path, data = {}, options = {}) {
    const app = this.getService(service);
    if (!app) {
      throw new Error(`Service ${service} not registered`);
    }

    let req = request(app).put(path).send(data);

    if (options.auth) {
      req = req.set(this.getAuthHeaders());
    }

    if (options.headers) {
      req = req.set(options.headers);
    }

    return req;
  }

  async delete(service, path, options = {}) {
    const app = this.getService(service);
    if (!app) {
      throw new Error(`Service ${service} not registered`);
    }

    let req = request(app).delete(path);

    if (options.auth) {
      req = req.set(this.getAuthHeaders());
    }

    if (options.headers) {
      req = req.set(options.headers);
    }

    return req;
  }

  // Data factory helpers
  createUserData(overrides = {}) {
    return {
      email: 'user@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT',
      ...overrides
    };
  }

  createSkillData(overrides = {}) {
    return {
      name: 'Test Skill',
      description: 'A test skill for learning',
      category: 'technology',
      difficulty: 'beginner',
      estimatedHours: 10,
      topics: ['topic1', 'topic2'],
      ...overrides
    };
  }

  createProgressData(overrides = {}) {
    return {
      skillId: 'test-skill-id',
      progress: 50,
      completed: false,
      ...overrides
    };
  }

  // Assertion helpers
  expectValidationError(response, field) {
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Error');
    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field })
      ])
    );
  }

  expectUnauthorized(response) {
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  }

  expectForbidden(response) {
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Forbidden');
  }

  expectNotFound(response) {
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Not Found');
  }

  expectSuccess(response, expectedStatus = 200) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toBeDefined();
  }

  // Performance testing helpers
  async measurePerformance(fn, iterations = 100) {
    const startTime = process.hrtime.bigint();

    for (let i = 0; i < iterations; i++) {
      await fn();
    }

    const endTime = process.hrtime.bigint();
    const totalTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

    return {
      totalTime,
      averageTime: totalTime / iterations,
      iterations
    };
  }

  // Load testing helpers
  async loadTest(fn, options = {}) {
    const {
      concurrent = 10,
      duration = 30000, // 30 seconds
      rampUp = 5000 // 5 seconds
    } = options;

    const results = [];
    const startTime = Date.now();
    const endTime = startTime + duration;

    // Ramp up gradually
    for (let i = 1; i <= concurrent; i++) {
      setTimeout(async () => {
        while (Date.now() < endTime) {
          const requestStart = Date.now();
          try {
            await fn();
            results.push({
              success: true,
              responseTime: Date.now() - requestStart
            });
          } catch (error) {
            results.push({
              success: false,
              error: error.message,
              responseTime: Date.now() - requestStart
            });
          }
        }
      }, (i - 1) * (rampUp / concurrent));
    }

    // Wait for completion
    await new Promise(resolve => setTimeout(resolve, duration + rampUp));

    // Calculate statistics
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const responseTimes = successful.map(r => r.responseTime);

    return {
      totalRequests: results.length,
      successful: successful.length,
      failed: failed.length,
      successRate: (successful.length / results.length) * 100,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      errors: failed.map(r => r.error)
    };
  }

  // Mock helpers
  mockService(serviceName, implementation) {
    const originalService = this.getService(serviceName);
    this.registerService(serviceName, implementation);

    return {
      restore: () => {
        if (originalService) {
          this.registerService(serviceName, originalService);
        }
      }
    };
  }

  // Wait helpers
  async waitFor(condition, timeout = 5000, interval = 100) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  }

  // Snapshot testing helpers
  toMatchSnapshot(received, snapshotName) {
    // Simple snapshot implementation
    const fs = require('fs');
    const path = require('path');

    const snapshotDir = path.join(process.cwd(), '__snapshots__');
    const snapshotFile = path.join(snapshotDir, `${snapshotName}.json`);

    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }

    if (fs.existsSync(snapshotFile)) {
      const snapshot = JSON.parse(fs.readFileSync(snapshotFile, 'utf8'));
      expect(received).toEqual(snapshot);
    } else {
      fs.writeFileSync(snapshotFile, JSON.stringify(received, null, 2));
      console.log(`Snapshot created: ${snapshotFile}`);
    }
  }
}

// Global test instance
global.testFramework = new TestFramework();

module.exports = TestFramework;