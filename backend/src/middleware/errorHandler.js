export function errorHandler(err, req, res, _next) {
  console.error('[API Error]', err)

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    return res.status(409).json({
      error: `A record with this ${field} already exists.`,
    })
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      error: 'Validation failed',
      details,
    })
  }

  // Handle Mongoose CastError (e.g. invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid identifier for ${err.path}`,
    })
  }

  const statusCode = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({ error: message })
}
