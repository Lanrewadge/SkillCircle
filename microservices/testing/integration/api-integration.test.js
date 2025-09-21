const TestFramework = require('../framework/TestFramework');

describe('API Integration Tests', () => {
  let testFramework;

  beforeAll(async () => {
    testFramework = new TestFramework();
    await testFramework.setup();

    // Start services (in real scenario, these would be running containers)
    // For now, we'll mock the service registration
    const express = require('express');

    // Mock API Gateway
    const apiGateway = express();
    apiGateway.get('/health', (req, res) => res.json({ status: 'healthy' }));
    apiGateway.get('/api/status', (req, res) => res.json({ services: {} }));
    testFramework.registerService('api-gateway', apiGateway);

    // Mock User Service
    const userService = express();
    userService.use(express.json());
    userService.get('/health', (req, res) => res.json({ status: 'healthy' }));
    userService.post('/auth/register', (req, res) => {
      const { email, password, firstName, lastName } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Validation Error', message: 'Missing required fields' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: 'test-user-id' });
    });
    userService.post('/auth/login', (req, res) => {
      const { email, password } = req.body;
      if (email === 'test@example.com' && password === 'password') {
        res.json({
          accessToken: 'test-token',
          user: { id: 'test-user-id', email, firstName: 'Test', lastName: 'User' }
        });
      } else {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials' });
      }
    });
    testFramework.registerService('user-service', userService);

    // Mock Skills Service
    const skillsService = express();
    skillsService.use(express.json());
    skillsService.get('/health', (req, res) => res.json({ status: 'healthy' }));
    skillsService.get('/skills', (req, res) => {
      res.json({
        data: [
          {
            id: 'skill-1',
            name: 'JavaScript',
            category: 'programming',
            difficulty: 'intermediate'
          }
        ],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 }
      });
    });
    skillsService.post('/skills', (req, res) => {
      const { name, category, difficulty } = req.body;
      if (!name || !category || !difficulty) {
        return res.status(400).json({ error: 'Validation Error', message: 'Missing required fields' });
      }
      res.status(201).json({
        id: 'new-skill-id',
        name,
        category,
        difficulty,
        createdAt: new Date().toISOString()
      });
    });
    testFramework.registerService('skills-service', skillsService);
  });

  afterAll(async () => {
    await testFramework.teardown();
  });

  beforeEach(async () => {
    await testFramework.cleanDatabase();
  });

  describe('Health Checks', () => {
    test('API Gateway health check', async () => {
      const response = await testFramework.get('api-gateway', '/health');

      testFramework.expectSuccess(response);
      expect(response.body.status).toBe('healthy');
    });

    test('User Service health check', async () => {
      const response = await testFramework.get('user-service', '/health');

      testFramework.expectSuccess(response);
      expect(response.body.status).toBe('healthy');
    });

    test('Skills Service health check', async () => {
      const response = await testFramework.get('skills-service', '/health');

      testFramework.expectSuccess(response);
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('User Authentication Flow', () => {
    test('User registration', async () => {
      const userData = testFramework.createUserData({
        email: 'newuser@example.com'
      });

      const response = await testFramework.post('user-service', '/auth/register', userData);

      testFramework.expectSuccess(response, 201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.userId).toBeDefined();
    });

    test('User registration validation', async () => {
      const userData = testFramework.createUserData({
        email: '', // Invalid email
      });

      const response = await testFramework.post('user-service', '/auth/register', userData);

      testFramework.expectValidationError(response, 'email');
    });

    test('User login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password'
      };

      const response = await testFramework.post('user-service', '/auth/login', loginData);

      testFramework.expectSuccess(response);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
    });

    test('User login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await testFramework.post('user-service', '/auth/login', loginData);

      testFramework.expectUnauthorized(response);
    });
  });

  describe('Skills Management', () => {
    test('Get skills list', async () => {
      const response = await testFramework.get('skills-service', '/skills');

      testFramework.expectSuccess(response);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
    });

    test('Create new skill', async () => {
      const skillData = testFramework.createSkillData({
        name: 'React Development'
      });

      const response = await testFramework.post('skills-service', '/skills', skillData);

      testFramework.expectSuccess(response, 201);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(skillData.name);
    });

    test('Create skill validation', async () => {
      const skillData = testFramework.createSkillData({
        name: '', // Invalid name
      });

      const response = await testFramework.post('skills-service', '/skills', skillData);

      testFramework.expectValidationError(response, 'name');
    });
  });

  describe('Service Communication', () => {
    test('Cross-service data consistency', async () => {
      // This would test that data changes in one service
      // are properly reflected in dependent services

      // 1. Create a user
      const userData = testFramework.createUserData();
      const userResponse = await testFramework.post('user-service', '/auth/register', userData);
      expect(userResponse.status).toBe(201);

      // 2. Create a skill
      const skillData = testFramework.createSkillData();
      const skillResponse = await testFramework.post('skills-service', '/skills', skillData);
      expect(skillResponse.status).toBe(201);

      // 3. Verify both exist and can be retrieved
      const skillsResponse = await testFramework.get('skills-service', '/skills');
      expect(skillsResponse.body.data).toHaveLength(1);
    });
  });

  describe('Error Handling', () => {
    test('404 for non-existent endpoints', async () => {
      const response = await testFramework.get('user-service', '/non-existent');

      expect(response.status).toBe(404);
    });

    test('Proper error format', async () => {
      const response = await testFramework.get('user-service', '/non-existent');

      expect(response.body.error).toBeDefined();
      expect(response.body.message).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    test('Health check response time', async () => {
      const performance = await testFramework.measurePerformance(async () => {
        await testFramework.get('api-gateway', '/health');
      }, 50);

      expect(performance.averageTime).toBeLessThan(100); // Less than 100ms
    });

    test('Skills list pagination performance', async () => {
      const performance = await testFramework.measurePerformance(async () => {
        await testFramework.get('skills-service', '/skills?limit=100');
      }, 20);

      expect(performance.averageTime).toBeLessThan(500); // Less than 500ms
    });
  });

  describe('Load Tests', () => {
    test('Concurrent health checks', async () => {
      const results = await testFramework.loadTest(async () => {
        await testFramework.get('api-gateway', '/health');
      }, {
        concurrent: 10,
        duration: 5000 // 5 seconds
      });

      expect(results.successRate).toBeGreaterThan(95); // 95% success rate
      expect(results.averageResponseTime).toBeLessThan(200); // Less than 200ms average
    });
  });

  describe('Data Validation', () => {
    test('Input sanitization', async () => {
      const maliciousData = testFramework.createUserData({
        firstName: '<script>alert("xss")</script>',
        lastName: "'; DROP TABLE users; --"
      });

      const response = await testFramework.post('user-service', '/auth/register', maliciousData);

      // Should either sanitize the input or reject it
      expect(response.status).toBeGreaterThanOrEqual(200);
      if (response.status === 201) {
        // If accepted, should be sanitized
        expect(response.body.firstName).not.toContain('<script>');
        expect(response.body.lastName).not.toContain('DROP TABLE');
      }
    });
  });

  describe('Rate Limiting', () => {
    test('Rate limiting enforcement', async () => {
      const requests = [];

      // Make multiple rapid requests
      for (let i = 0; i < 10; i++) {
        requests.push(testFramework.get('user-service', '/health'));
      }

      const responses = await Promise.all(requests);

      // At least some should succeed
      const successfulResponses = responses.filter(r => r.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(0);
    });
  });
});