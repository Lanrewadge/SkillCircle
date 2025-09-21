#!/bin/bash

# Skill Circle Microservices Deployment Script
# This script deploys the complete Skill Circle microservices platform to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="skill-circle"
MONITORING_NAMESPACE="skill-circle-monitoring"
SYSTEM_NAMESPACE="skill-circle-system"

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

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl is not installed or not in PATH"
        exit 1
    fi
    print_success "kubectl is available"
}

# Function to check if cluster is accessible
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    print_success "Connected to Kubernetes cluster"
}

# Function to create namespaces
create_namespaces() {
    print_status "Creating namespaces..."
    kubectl apply -f namespace.yaml
    print_success "Namespaces created"
}

# Function to create secrets
create_secrets() {
    print_status "Creating secrets..."
    print_warning "Please ensure you have updated the secrets.yaml file with your actual credentials"

    # Check if secrets already exist
    if kubectl get secret skill-circle-secrets -n $NAMESPACE &> /dev/null; then
        print_warning "Secrets already exist. Skipping creation."
        print_warning "To update secrets, delete them first: kubectl delete secret skill-circle-secrets -n $NAMESPACE"
    else
        kubectl apply -f secrets.yaml
        print_success "Secrets created"
    fi
}

# Function to create config maps
create_configmaps() {
    print_status "Creating config maps..."
    kubectl apply -f configmap.yaml
    print_success "Config maps created"
}

# Function to deploy infrastructure services
deploy_infrastructure() {
    print_status "Deploying infrastructure services..."

    # Deploy using Helm charts if available, otherwise use docker-compose services
    if [ -f "../deployment/helm/skill-circle/Chart.yaml" ]; then
        print_status "Using Helm for infrastructure deployment..."
        helm upgrade --install skill-circle-infra ../deployment/helm/skill-circle \
            --namespace $NAMESPACE \
            --set postgresql.enabled=true \
            --set mongodb.enabled=true \
            --set redis.enabled=true \
            --set rabbitmq.enabled=true \
            --set kafka.enabled=true \
            --wait --timeout=600s
    else
        print_warning "Helm chart not found. Infrastructure services should be deployed separately."
        print_warning "You can use the docker-compose.yml file to start infrastructure services."
    fi

    print_success "Infrastructure services deployed"
}

# Function to deploy application services
deploy_services() {
    print_status "Deploying application services..."

    # Deploy services in order
    local services=("api-gateway" "user-service" "skills-service" "learning-service" "content-service" "visualization-service" "notification-service")

    for service in "${services[@]}"; do
        print_status "Deploying $service..."
        kubectl apply -f "$service.yaml"

        # Wait for deployment to be ready
        kubectl rollout status deployment/$service -n $NAMESPACE --timeout=300s
        print_success "$service deployed successfully"
    done
}

# Function to setup network policies
setup_network_policies() {
    print_status "Setting up network policies..."
    kubectl apply -f network-policies.yaml
    print_success "Network policies applied"
}

# Function to setup ingress
setup_ingress() {
    print_status "Setting up ingress..."

    # Check if nginx-ingress is installed
    if ! kubectl get namespace nginx-ingress &> /dev/null; then
        print_warning "nginx-ingress namespace not found. Installing nginx-ingress..."
        kubectl create namespace nginx-ingress
        helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
        helm repo update
        helm install nginx-ingress ingress-nginx/ingress-nginx \
            --namespace nginx-ingress \
            --set controller.publishService.enabled=true
    fi

    kubectl apply -f ingress.yaml
    print_success "Ingress configured"
}

# Function to setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."

    # Check if monitoring namespace exists
    if ! kubectl get namespace $MONITORING_NAMESPACE &> /dev/null; then
        kubectl create namespace $MONITORING_NAMESPACE
    fi

    # Install Prometheus and Grafana using Helm
    if command -v helm &> /dev/null; then
        print_status "Installing Prometheus..."
        helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
        helm repo update

        helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
            --namespace $MONITORING_NAMESPACE \
            --set grafana.adminPassword=admin123 \
            --set prometheus.prometheusSpec.retention=30d \
            --wait --timeout=600s

        print_success "Monitoring stack deployed"
    else
        print_warning "Helm not found. Please install monitoring manually."
    fi
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."

    # Check if all pods are running
    echo "Checking pod status in $NAMESPACE namespace..."
    kubectl get pods -n $NAMESPACE

    # Check services
    echo "Checking services in $NAMESPACE namespace..."
    kubectl get services -n $NAMESPACE

    # Check ingress
    echo "Checking ingress..."
    kubectl get ingress -n $NAMESPACE

    # Wait for all deployments to be ready
    print_status "Waiting for all deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment --all -n $NAMESPACE

    print_success "All deployments are ready!"
}

# Function to get access information
get_access_info() {
    print_status "Getting access information..."

    # Get external IP of load balancer
    EXTERNAL_IP=$(kubectl get service nginx-ingress-controller -n nginx-ingress -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "pending")

    if [ "$EXTERNAL_IP" != "pending" ] && [ -n "$EXTERNAL_IP" ]; then
        echo "================================"
        echo "🎉 Deployment Successful!"
        echo "================================"
        echo "External IP: $EXTERNAL_IP"
        echo "Application URL: https://skillcircle.com"
        echo "API Gateway: https://api.skillcircle.com"
        echo "Monitoring: https://monitoring.skillcircle.com"
        echo ""
        echo "📝 Next Steps:"
        echo "1. Point your domain to the external IP: $EXTERNAL_IP"
        echo "2. Ensure SSL certificates are properly configured"
        echo "3. Update DNS records for skillcircle.com and subdomains"
        echo "4. Monitor the deployment using Grafana dashboard"
        echo ""
        echo "🔧 Useful Commands:"
        echo "- View pods: kubectl get pods -n $NAMESPACE"
        echo "- View logs: kubectl logs -f deployment/<service-name> -n $NAMESPACE"
        echo "- Scale service: kubectl scale deployment <service-name> --replicas=3 -n $NAMESPACE"
    else
        echo "================================"
        echo "⏳ Deployment In Progress"
        echo "================================"
        echo "External IP is still being assigned..."
        echo "Run the following command to check when it's ready:"
        echo "kubectl get service nginx-ingress-controller -n nginx-ingress -w"
    fi
}

# Function to cleanup (optional)
cleanup() {
    print_warning "This will delete all Skill Circle resources. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up resources..."
        kubectl delete namespace $NAMESPACE
        kubectl delete namespace $MONITORING_NAMESPACE
        kubectl delete namespace $SYSTEM_NAMESPACE
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Main execution
main() {
    echo "================================"
    echo "🚀 Skill Circle Microservices Deployment"
    echo "================================"

    # Parse command line arguments
    case "${1:-deploy}" in
        "deploy")
            check_kubectl
            check_cluster
            create_namespaces
            create_secrets
            create_configmaps
            deploy_infrastructure
            deploy_services
            setup_network_policies
            setup_ingress
            setup_monitoring
            verify_deployment
            get_access_info
            ;;
        "cleanup")
            cleanup
            ;;
        "verify")
            verify_deployment
            get_access_info
            ;;
        "help")
            echo "Usage: $0 [deploy|cleanup|verify|help]"
            echo "  deploy  - Deploy the complete Skill Circle platform (default)"
            echo "  cleanup - Remove all Skill Circle resources"
            echo "  verify  - Verify the current deployment status"
            echo "  help    - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"