'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  showDetails: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      hasError: true
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false
    })
  }

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails
    }))
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          showDetails={this.state.showDetails}
          toggleDetails={this.toggleDetails}
        />
      )
    }

    return this.props.children
  }
}

interface DefaultErrorFallbackProps {
  error?: Error
  errorInfo?: React.ErrorInfo
  resetError: () => void
  showDetails: boolean
  toggleDetails: () => void
}

function DefaultErrorFallback({
  error,
  errorInfo,
  resetError,
  showDetails,
  toggleDetails
}: DefaultErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-background border border-destructive/20 rounded-lg shadow-lg">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                We encountered an unexpected error. Don't worry, we're working to fix it.
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-destructive mb-2">Error Details</h2>
              <p className="text-sm text-muted-foreground font-mono">
                {error.message || 'An unknown error occurred'}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={resetError} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Homepage</span>
            </Button>

            {isDevelopment && (
              <Button
                variant="ghost"
                onClick={toggleDetails}
                className="flex items-center space-x-2"
              >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showDetails ? 'Hide' : 'Show'} Technical Details</span>
              </Button>
            )}
          </div>

          {/* Technical details - only in development */}
          {isDevelopment && showDetails && (
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Technical Details</h3>

              {error && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Error Stack
                  </h4>
                  <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto max-h-48">
                    <code>{error.stack}</code>
                  </pre>
                </div>
              )}

              {errorInfo && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Component Stack
                  </h4>
                  <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto max-h-48">
                    <code>{errorInfo.componentStack}</code>
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Help text */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>What can you do?</strong>
            </p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Try refreshing the page</li>
              <li>Clear your browser cache and cookies</li>
              <li>Check your internet connection</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified error fallback for smaller components
interface SimpleErrorFallbackProps {
  error?: Error
  resetError: () => void
  className?: string
  message?: string
}

export function SimpleErrorFallback({
  error,
  resetError,
  className,
  message = 'Something went wrong with this component'
}: SimpleErrorFallbackProps) {
  return (
    <div className={cn(
      'bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-center',
      className
    )}>
      <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      {error && process.env.NODE_ENV === 'development' && (
        <p className="text-xs text-muted-foreground mb-3 font-mono">
          {error.message}
        </p>
      )}
      <Button size="sm" onClick={resetError}>
        Try Again
      </Button>
    </div>
  )
}

// Hook for handling errors in function components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo)

    // You could send this to an error reporting service
    // reportError(error, errorInfo)
  }
}

export default ErrorBoundary