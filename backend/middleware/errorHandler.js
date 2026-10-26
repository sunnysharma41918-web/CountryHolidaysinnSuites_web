export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  })
}

export const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message

  // Log error for debugging
  if (process.env.NODE_ENV !== 'test') {
    console.error('💥 [Server Error]:', err)
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Invalid resource identifier format: ${err.value}`
    return res.status(400).json({ success: false, message })
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    const value = err.keyValue ? err.keyValue[field] : ''
    const message = `Duplicate value '${value}' entered for unique field: ${field}. Please use another value.`
    return res.status(409).json({ success: false, message, field })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((val) => val.message)
    const message = `Validation Error: ${errors.join('. ')}`
    return res.status(400).json({ success: false, message, errors })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid authentication token.' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Authentication token has expired.' })
  }

  // General server error
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
