const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message)

  // Default error
  let error = {
    message: err.message || 'Something went wrong',
    status: err.status || 500
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found'
    error.status = 404
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    error.message = `${field} already exists`
    error.status = 400
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(error => error.message).join(', ')
    error.message = message
    error.status = 400
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token'
    error.status = 401
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired'
    error.status = 401
  }

  res.status(error.status).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler