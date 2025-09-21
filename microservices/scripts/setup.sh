#!/bin/bash

# Skill Circle Microservices Setup Script
# This script sets up the complete microservices environment

set -e

echo "🚀 Setting up Skill Circle Microservices..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop."
        exit 1
    fi

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_warning "Node.js is not installed. Some development commands may not work."
    fi

    print_success "Prerequisites check completed"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."

    if [ ! -f .env ]; then
        cp .env.example .env
        print_success "Created .env file from template"
        print_warning "Please update the .env file with your actual configuration"
    else
        print_warning ".env file already exists, skipping creation"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."

    mkdir -p logs/{api-gateway,user-service,skills-service,learning-service,content-service,visualization-service,notification-service}
    mkdir -p data/{postgres,mongodb,redis}
    mkdir -p uploads/{user-service,content-service}
    mkdir -p cache/visualization-service
    mkdir -p nginx/{sites,ssl}

    print_success "Directories created"
}

# Generate SSL certificates for development
generate_ssl_certs() {
    print_status "Generating SSL certificates for development..."

    if [ ! -f nginx/ssl/cert.pem ]; then
        openssl req -x509 -newkey rsa:4096 -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem -days 365 -nodes \
            -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"
        print_success "SSL certificates generated"
    else
        print_warning "SSL certificates already exist"
    fi
}

# Setup databases
setup_databases() {
    print_status "Setting up databases..."

    # Start infrastructure services first
    docker-compose up -d consul redis postgres mongodb

    print_status "Waiting for databases to be ready..."
    sleep 30

    # Wait for PostgreSQL
    until docker-compose exec -T postgres pg_isready -U skill_circle_user -d skill_circle; do
        print_status "Waiting for PostgreSQL..."
        sleep 5
    done

    # Wait for MongoDB
    until docker-compose exec -T mongodb mongo --eval "db.adminCommand('ismaster')"; do
        print_status "Waiting for MongoDB..."
        sleep 5
    done

    print_success "Databases are ready"
}

# Build and start services
build_services() {
    print_status "Building Docker images..."
    docker-compose build
    print_success "Docker images built"

    print_status "Starting all services..."
    docker-compose up -d

    print_status "Waiting for services to be healthy..."
    sleep 60

    # Check service health
    check_service_health
}

# Check service health
check_service_health() {
    print_status "Checking service health..."

    services=("api-gateway:3000" "user-service:3001" "skills-service:3002")

    for service in "${services[@]}"; do
        IFS=':' read -ra ADDR <<< "$service"
        service_name=${ADDR[0]}
        service_port=${ADDR[1]}

        if curl -f http://localhost:$service_port/health &> /dev/null; then
            print_success "$service_name is healthy"
        else
            print_error "$service_name is not responding"
        fi
    done
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."

    # User service migrations
    docker-compose exec -T user-service npx prisma migrate deploy
    print_success "User service migrations completed"

    # Learning service migrations (when created)
    # docker-compose exec -T learning-service npx prisma migrate deploy
    # print_success "Learning service migrations completed"
}

# Seed initial data
seed_data() {
    print_status "Seeding initial data..."

    # Seed skills data
    docker-compose exec -T skills-service npm run seed
    print_success "Skills data seeded"

    # Seed content data (when created)
    # docker-compose exec -T content-service npm run seed
    # print_success "Content data seeded"
}

# Display service URLs
display_urls() {
    print_success "🎉 Skill Circle Microservices setup completed!"
    echo ""
    echo "📋 Service URLs:"
    echo "  API Gateway:      http://localhost:3000"
    echo "  User Service:     http://localhost:3001"
    echo "  Skills Service:   http://localhost:3002"
    echo "  Learning Service: http://localhost:3003 (pending)"
    echo "  Content Service:  http://localhost:3004 (pending)"
    echo "  Visualization:    http://localhost:3005 (pending)"
    echo "  Notification:     http://localhost:3006 (pending)"
    echo ""
    echo "🔧 Management URLs:"
    echo "  Consul UI:        http://localhost:8500"
    echo "  Redis Commander: http://localhost:8081"
    echo "  Mongo Express:   http://localhost:8082"
    echo ""
    echo "📊 Health Check:"
    echo "  curl http://localhost:3000/api/status"
    echo ""
    echo "📝 Logs:"
    echo "  docker-compose logs -f [service-name]"
    echo ""
    echo "🛑 Stop Services:"
    echo "  docker-compose down"
    echo ""
}

# Main setup flow
main() {
    echo ""
    echo "======================================"
    echo "  Skill Circle Microservices Setup  "
    echo "======================================"
    echo ""

    check_prerequisites
    setup_environment
    create_directories
    generate_ssl_certs
    setup_databases
    build_services
    run_migrations
    seed_data
    display_urls

    print_success "Setup completed successfully! 🚀"
}

# Handle script interruption
trap 'print_error "Setup interrupted"; exit 1' INT

# Run main function
main "$@"