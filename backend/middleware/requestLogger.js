// middleware/requestLogger.js - Custom Request Logging Middleware
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'warn' : 'info';

    logger[level](
      `${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms` +
      (req.user ? ` [User: ${req.user.email} | ${req.user.role}]` : ' [Guest]')
    );
  });

  next();
};

module.exports = requestLogger;