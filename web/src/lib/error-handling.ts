import { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export class AppError extends Error {
  public status: number
  public code?: string
  public details?: any

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || error.message || 'An error occurred'
    const code = error.response?.data?.code || error.code
    const details = error.response?.data?.details

    return {
      message,
      status,
      code,
      details
    }
  }

  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    }
  }

  return {
    message: 'An unexpected error occurred',
    status: 500
  }
}

export const showErrorToast = (error: unknown, fallbackMessage?: string) => {
  const apiError = handleApiError(error)
  const message = fallbackMessage || apiError.message

  switch (apiError.status) {
    case 400:
      toast.error(`Bad Request: ${message}`)
      break
    case 401:
      toast.error('Please log in to continue')
      break
    case 403:
      toast.error('Access denied')
      break
    case 404:
      toast.error('Resource not found')
      break
    case 422:
      toast.error(`Validation Error: ${message}`)
      break
    case 429:
      toast.error('Too many requests. Please try again later.')
      break
    case 500:
      toast.error('Server error. Please try again.')
      break
    default:
      toast.error(message)
  }
}

export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxRetries) {
        break
      }

      // Don't retry on client errors (4xx)
      if (error instanceof AxiosError && error.response?.status && error.response.status < 500) {
        break
      }

      const delay = baseDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options?: {
    showToast?: boolean
    fallbackMessage?: string
    retry?: boolean
    maxRetries?: number
  }
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      const result = options?.retry
        ? await retryWithExponentialBackoff(() => fn(...args), options.maxRetries)
        : await fn(...args)

      return result
    } catch (error) {
      console.error('Error in withErrorHandling:', error)

      if (options?.showToast !== false) {
        showErrorToast(error, options?.fallbackMessage)
      }

      // Log error to monitoring service
      logError(error, { function: fn.name, args })

      return null
    }
  }
}

export const logError = (error: unknown, context?: Record<string, any>) => {
  const errorInfo = {
    error: handleApiError(error),
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined
  }

  console.error('Application Error:', errorInfo)

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, or custom service
    // errorMonitoringService.captureException(error, { extra: errorInfo })
  }
}

// Custom hook for handling async operations with error handling
export const useAsyncOperation = () => {
  const executeWithErrorHandling = async <T>(
    operation: () => Promise<T>,
    options?: {
      loadingMessage?: string
      successMessage?: string
      errorMessage?: string
      showToast?: boolean
    }
  ): Promise<T | null> => {
    if (options?.loadingMessage && options.showToast !== false) {
      toast.loading(options.loadingMessage)
    }

    try {
      const result = await operation()

      toast.dismiss()

      if (options?.successMessage && options.showToast !== false) {
        toast.success(options.successMessage)
      }

      return result
    } catch (error) {
      toast.dismiss()

      if (options?.showToast !== false) {
        showErrorToast(error, options?.errorMessage)
      }

      logError(error, { operation: operation.name })
      return null
    }
  }

  return { executeWithErrorHandling }
}

// Validation helpers
export const validateRequired = (value: any, fieldName: string): void => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR')
  }
}

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400, 'VALIDATION_ERROR')
  }
}

export const validateMinLength = (value: string, minLength: number, fieldName: string): void => {
  if (value.length < minLength) {
    throw new AppError(`${fieldName} must be at least ${minLength} characters long`, 400, 'VALIDATION_ERROR')
  }
}