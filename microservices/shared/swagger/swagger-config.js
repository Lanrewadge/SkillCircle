const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Base Swagger configuration
const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skill Circle Microservices API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for Skill Circle microservices platform',
      contact: {
        name: 'Skill Circle Team',
        email: 'api@skillcircle.com',
        url: 'https://skillcircle.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      },
      {
        url: 'https://api-staging.skillcircle.com/api',
        description: 'Staging server'
      },
      {
        url: 'https://api.skillcircle.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for service-to-service communication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'firstName', 'lastName'],
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            role: {
              type: 'string',
              enum: ['STUDENT', 'TEACHER', 'ADMIN'],
              description: 'User role'
            },
            avatar: {
              type: 'string',
              format: 'uri',
              description: 'User avatar URL'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            }
          }
        },
        Skill: {
          type: 'object',
          required: ['name', 'category', 'difficulty'],
          properties: {
            id: {
              type: 'string',
              description: 'Skill unique identifier'
            },
            name: {
              type: 'string',
              description: 'Skill name'
            },
            description: {
              type: 'string',
              description: 'Skill description'
            },
            category: {
              type: 'string',
              enum: ['technology', 'programming', 'design', 'business', 'science', 'languages', 'health', 'cooking'],
              description: 'Skill category'
            },
            difficulty: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced', 'expert'],
              description: 'Skill difficulty level'
            },
            estimatedHours: {
              type: 'integer',
              minimum: 1,
              description: 'Estimated hours to complete'
            },
            prerequisites: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/SkillPrerequisite'
              }
            },
            topics: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Skill topics'
            }
          }
        },
        SkillPrerequisite: {
          type: 'object',
          properties: {
            skillId: {
              type: 'string',
              description: 'Prerequisite skill ID'
            },
            name: {
              type: 'string',
              description: 'Prerequisite skill name'
            },
            required: {
              type: 'boolean',
              description: 'Whether prerequisite is required'
            },
            proficiencyLevel: {
              type: 'string',
              enum: ['basic', 'intermediate', 'advanced'],
              description: 'Required proficiency level'
            }
          }
        },
        Progress: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Progress unique identifier'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            skillId: {
              type: 'string',
              description: 'Skill ID'
            },
            progress: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Progress percentage'
            },
            completed: {
              type: 'boolean',
              description: 'Whether skill is completed'
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When user started learning'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When user completed skill'
            }
          }
        },
        Error: {
          type: 'object',
          required: ['error', 'message'],
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Additional error details'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {},
              description: 'Response data'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  description: 'Current page number'
                },
                limit: {
                  type: 'integer',
                  description: 'Items per page'
                },
                total: {
                  type: 'integer',
                  description: 'Total number of items'
                },
                pages: {
                  type: 'integer',
                  description: 'Total number of pages'
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ValidationError: {
          description: 'Input validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20
          }
        },
        SortParam: {
          name: 'sort',
          in: 'query',
          description: 'Sort field and direction (e.g., name:asc, createdAt:desc)',
          schema: {
            type: 'string'
          }
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Search query',
          schema: {
            type: 'string'
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and session management'
      },
      {
        name: 'Users',
        description: 'User profile management'
      },
      {
        name: 'Skills',
        description: 'Skills catalog and management'
      },
      {
        name: 'Learning',
        description: 'Learning progress and assessments'
      },
      {
        name: 'Content',
        description: 'Course content and resources'
      },
      {
        name: 'Visualization',
        description: 'Interactive visualizations and charts'
      },
      {
        name: 'Notifications',
        description: 'Notification management'
      }
    ]
  },
  apis: [] // Will be populated by each service
};

// Service-specific configurations
const serviceConfigs = {
  'api-gateway': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'Skill Circle API Gateway',
        description: 'Central API Gateway for all Skill Circle services'
      }
    },
    apis: [
      './src/routes/*.js',
      './src/middleware/*.js'
    ]
  },

  'user-service': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'User Service API',
        description: 'User authentication and profile management service'
      }
    },
    apis: [
      './src/routes/*.js',
      './src/models/*.js'
    ]
  },

  'skills-service': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'Skills Service API',
        description: 'Skills catalog and management service'
      }
    },
    apis: [
      './src/routes/*.js',
      './src/models/*.js'
    ]
  },

  'learning-service': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'Learning Service API',
        description: 'Learning progress and assessment service'
      }
    },
    apis: [
      './src/routes/*.js',
      './src/models/*.js'
    ]
  },

  'content-service': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'Content Service API',
        description: 'Course content and resource management service'
      }
    },
    apis: [
      './src/routes/*.js',
      './src/models/*.js'
    ]
  },

  'visualization-service': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'Visualization Service API',
        description: 'Interactive visualizations and chart generation service'
      }
    },
    apis: [
      './src/routes/*.js'
    ]
  },

  'notification-service': {
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      info: {
        ...baseOptions.definition.info,
        title: 'Notification Service API',
        description: 'Real-time notification and messaging service'
      }
    },
    apis: [
      './src/routes/*.js'
    ]
  }
};

// Setup function for each service
const setupSwagger = (app, serviceName) => {
  const config = serviceConfigs[serviceName] || baseOptions;
  const specs = swaggerJsdoc(config);

  // Custom CSS for branding
  const customCss = `
    .swagger-ui .topbar { background-color: #1e40af; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .info .title { color: #1e40af; }
  `;

  const options = {
    customCss,
    customSiteTitle: `${config.definition.info.title} - API Documentation`,
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true
    }
  };

  // Serve Swagger documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, options));

  // Serve raw OpenAPI spec
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  return specs;
};

module.exports = {
  setupSwagger,
  serviceConfigs,
  baseOptions
};