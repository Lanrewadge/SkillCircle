import { Request, Response, NextFunction } from 'express';

interface ApiError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  console.error(`[ERROR] ${statusCode} - ${message}:`, err);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      ...(err.errors && { details: err.errors })
    }
  });
};

export const createError = (statusCode: number, message: string, errors?: any): ApiError => {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  if (errors) error.errors = errors;
  return error;
};