# 🎯 Skill Circle Microservices Migration Guide

## Overview

This guide explains how to migrate from the existing monolithic Skill Circle application to a microservices architecture. The migration provides better scalability, maintainability, and development team independence.

## 🏗️ Architecture Comparison

### Before: Monolithic Architecture
```
┌─────────────────────────────────────┐
│           Monolithic App            │
│                                     │
│  • All features in one codebase    │
│  • Single database                 │
│  • Shared dependencies             │
│  • Single deployment unit          │
│                                     │
└─────────────────────────────────────┘
```

### After: Microservices Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 3000)                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
┌───▼────┐  ┌────▼────┐  ┌─────▼──────┐
│ User   │  │ Skills  │  │ Learning   │
│Service │  │Service  │  │ Service    │
│:3001   │  │:3002    │  │ :3003      │
└────────┘  └─────────┘  └────────────┘

┌────────┐  ┌──────────┐  ┌────────────┐
│Content │  │Visualiz. │  │Notification│
│Service │  │Service   │  │Service     │
│:3004   │  │:3005     │  │:3006       │
└────────┘  └──────────┘  └────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- Git

### 1. Setup Environment
```bash
# Clone or navigate to microservices directory
cd skill-circle/microservices

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # Update with your configuration
```

### 2. One-Command Setup
```bash
# Make setup script executable
chmod +x scripts/setup.sh

# Run complete setup
./scripts/setup.sh
```

### 3. Manual Setup (Alternative)
```bash
# Start infrastructure
docker-compose up -d consul redis postgres mongodb

# Build and start services
docker-compose build
docker-compose up -d

# Run migrations
docker-compose exec user-service npx prisma migrate deploy

# Seed data
docker-compose exec skills-service npm run seed
```

## 📊 Service Details

### 1. API Gateway (Port 3000)
**Purpose**: Entry point for all client requests
- Routes requests to appropriate services
- Handles authentication and authorization
- Implements rate limiting and CORS
- Provides service health monitoring

**Key Features**:
- JWT token validation
- Service discovery integration
- Load balancing
- Request/response logging
- Circuit breaker pattern

### 2. User Service (Port 3001)
**Purpose**: User authentication and profile management
- User registration and login
- JWT token management
- Profile information
- User preferences
- Password reset functionality

**Database**: PostgreSQL
**Key Features**:
- Secure password hashing
- Email verification
- Session management
- Account lockout protection
- Activity logging

### 3. Skills Service (Port 3002)
**Purpose**: Skills catalog and management
- Skill definitions and metadata
- Categories and subcategories
- Learning roadmaps
- Prerequisites tracking
- Skill analytics

**Database**: MongoDB
**Key Features**:
- Full-text search
- Skill relationships
- Popularity tracking
- Rating system
- SEO optimization

### 4. Learning Service (Port 3003)
**Purpose**: Progress tracking and assessments
- Learning progress tracking
- Assessment and quiz management
- Achievement system
- Certificate generation
- Learning analytics

**Database**: PostgreSQL
**Key Features**:
- Real-time progress updates
- Comprehensive analytics
- Gamification elements
- Performance tracking
- Certificate management

### 5. Content Service (Port 3004)
**Purpose**: Course and content management
- Course content
- Encyclopedia articles
- Resource libraries
- Institutional course data
- Content versioning

**Database**: MongoDB
**Key Features**:
- Rich content management
- Version control
- Content publishing workflow
- Media file handling
- Search optimization

### 6. Visualization Service (Port 3005)
**Purpose**: Interactive visualizations
- Skill visualizations
- Progress charts
- Interactive diagrams
- SVG generation
- Chart caching

**Database**: Redis (caching)
**Key Features**:
- Dynamic chart generation
- SVG optimization
- Caching for performance
- Multiple visualization types
- Real-time updates

### 7. Notification Service (Port 3006)
**Purpose**: Real-time notifications
- Email notifications
- Real-time alerts
- Push notifications
- WebSocket connections
- Notification templates

**Database**: Redis
**Key Features**:
- Multi-channel delivery
- Real-time WebSocket support
- Template management
- Delivery tracking
- Preference handling

## 🔄 Migration Strategy

### Phase 1: Infrastructure Setup ✅
- [x] Set up Docker environment
- [x] Configure service discovery (Consul)
- [x] Set up databases (PostgreSQL, MongoDB, Redis)
- [x] Create API Gateway

### Phase 2: Core Services ✅
- [x] Migrate User Authentication
- [x] Migrate Skills Management
- [ ] Migrate Learning Progress
- [ ] Migrate Content Management

### Phase 3: Advanced Services
- [ ] Create Visualization Service
- [ ] Create Notification Service
- [ ] Add monitoring and observability

### Phase 4: Frontend Integration
- [ ] Update frontend to use API Gateway
- [ ] Implement service-specific error handling
- [ ] Add real-time features

### Phase 5: Production Deployment
- [ ] Set up Kubernetes manifests
- [ ] Configure CI/CD pipeline
- [ ] Implement monitoring and alerting
- [ ] Performance optimization

## 🛠️ Development Workflow

### Starting Development Environment
```bash
# Start all services
npm run dev

# Start specific services
docker-compose up api-gateway user-service skills-service

# Watch logs
npm run logs

# Check service status
npm run status
```

### Making Changes to Services
```bash
# Rebuild specific service
docker-compose build user-service
docker-compose up -d user-service

# View service logs
docker-compose logs -f user-service

# Execute commands in service
docker-compose exec user-service npm test
```

### Database Operations
```bash
# Run migrations
npm run migrate

# Access database
docker-compose exec postgres psql -U skill_circle_user -d skill_circle_users
docker-compose exec mongodb mongo skill_circle_skills

# Backup data
npm run backup

# Restore data
npm run restore
```

## 🔧 Configuration

### Environment Variables
Key environment variables to configure:

```env
# Security
JWT_SECRET=your-256-bit-secret
JWT_REFRESH_SECRET=your-256-bit-refresh-secret

# Databases
DATABASE_URL_USERS=postgresql://user:pass@localhost:5432/users
MONGODB_URI_SKILLS=mongodb://user:pass@localhost:27017/skills

# Services
USER_SERVICE_URL=http://user-service:3001
SKILLS_SERVICE_URL=http://skills-service:3002

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Service Configuration
Each service can be configured through environment variables:

- **Port Configuration**: `PORT=3001`
- **Database URLs**: Service-specific database connections
- **Service Discovery**: Consul configuration
- **Logging**: Log levels and output formats
- **Security**: JWT secrets and CORS settings

## 📈 Monitoring and Observability

### Service Health
- **Health Endpoints**: Each service exposes `/health`
- **Service Status**: API Gateway provides `/api/status`
- **Consul UI**: http://localhost:8500

### Database Management
- **PostgreSQL**: Direct connection or pgAdmin
- **MongoDB**: Mongo Express at http://localhost:8082
- **Redis**: Redis Commander at http://localhost:8081

### Logging
- **Centralized Logs**: `docker-compose logs -f`
- **Service-specific**: `docker-compose logs -f user-service`
- **Log Files**: `logs/` directory for persistent storage

## 🔐 Security Considerations

### Authentication & Authorization
- JWT tokens with refresh mechanism
- Role-based access control
- Session management with Redis
- Password security with bcrypt

### Network Security
- Internal service communication
- CORS configuration
- Rate limiting
- Input validation

### Data Security
- Database connection encryption
- Sensitive data masking in logs
- Environment variable protection
- Secure file uploads

## 🚀 Production Deployment

### Container Orchestration
```yaml
# Kubernetes deployment example
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    spec:
      containers:
      - name: user-service
        image: skill-circle/user-service:latest
        ports:
        - containerPort: 3001
```

### Load Balancing
- Nginx for external load balancing
- Consul for service discovery
- Health checks for automatic failover

### Scaling
```bash
# Scale services
docker-compose up -d --scale user-service=3
docker-compose up -d --scale skills-service=2
```

## 🔍 Troubleshooting

### Common Issues

1. **Service Won't Start**
   ```bash
   # Check logs
   docker-compose logs service-name

   # Check dependencies
   docker-compose ps

   # Restart service
   docker-compose restart service-name
   ```

2. **Database Connection Issues**
   ```bash
   # Check database status
   docker-compose exec postgres pg_isready
   docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"

   # Reset database
   docker-compose down -v
   docker-compose up -d postgres mongodb
   ```

3. **Service Discovery Issues**
   ```bash
   # Check Consul
   curl http://localhost:8500/v1/catalog/services

   # Re-register service
   docker-compose restart consul
   docker-compose restart api-gateway
   ```

### Performance Issues
- Check service resource usage: `docker stats`
- Monitor database connections
- Review service logs for bottlenecks
- Scale services as needed

## 📚 API Documentation

### API Gateway Endpoints
```
GET  /api/status          - Service status
POST /api/user/register   - User registration
POST /api/user/login      - User login
GET  /api/skills          - List skills
GET  /api/learning/progress - User progress
```

### Service-Specific APIs
Each service exposes its own API documentation at `/info` endpoint:
- http://localhost:3001/info (User Service)
- http://localhost:3002/info (Skills Service)

## 🤝 Contributing

### Adding New Services
1. Create service directory
2. Add Dockerfile and service code
3. Update docker-compose.yml
4. Add service to API Gateway routes
5. Update documentation

### Service Template
```javascript
// Basic service structure
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(process.env.PORT || 3000);
```

## 📞 Support

For questions and support:
- Review service logs
- Check health endpoints
- Consult troubleshooting guide
- Create issue with detailed information

---

**Happy Microservices Development! 🚀**