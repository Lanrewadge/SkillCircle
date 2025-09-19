'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
}

interface ErrorFallbackProps {
  error: Error | null
  resetError: () => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // Log error to monitoring service (e.g., Sentry, LogRocket)
    if (typeof window !== 'undefined') {
      // Send error to monitoring service
      this.logErrorToService(error, errorInfo)
    }
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    // In a real app, you would send this to your error monitoring service
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    console.log('Error logged:', errorDetails)

    // Example: Send to your error tracking service
    // errorTrackingService.captureException(error, { extra: errorDetails })
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            We apologize for the inconvenience. An unexpected error has occurred.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDevelopment && error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                Error Details (Development)
              </h4>
              <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                {error.message}
              </pre>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    console.error('Caught error:', error, errorInfo)

    // You can also dispatch to a global error state here
    // or send to error tracking service

    throw error // Re-throw to trigger error boundary
  }
}

// Higher-order component for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

export default ErrorBoundary