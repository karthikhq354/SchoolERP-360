// middleware/errorHandler.js - Global Error Handling Middleware
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  // ── Mongoose: Cast Error (invalid ObjectId) ────────────────────
  if (err.name === 'CastError') {
    message    = `Resource not found. Invalid ${err.path}: ${err.value}`;
    statusCode = 404;
  }

  // ── Mongoose: Duplicate Key Error ─────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `Duplicate value: '${err.keyValue[field]}' for field '${field}' already exists.`;
    statusCode = 409;
  }

  // ── Mongoose: Validation Error ────────────────────────────────
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    message    = `Validation failed: ${errors.join('. ')}`;
    statusCode = 400;
  }

  // ── JWT: Invalid Token ────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    message    = 'Invalid authentication token';
    statusCode = 401;
  }

  // ── JWT: Expired Token ────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    message    = 'Authentication token has expired';
    statusCode = 401;
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`[${statusCode}] ${message}\n${err.stack}`);
  } else {
    logger.warn(`[${statusCode}] ${message} — ${req.method} ${req.originalUrl}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
    }),
  });
};

module.exports = errorHandler;