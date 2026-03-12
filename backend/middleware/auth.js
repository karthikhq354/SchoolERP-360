// middleware/auth.js - JWT Authentication & Role-Based Access Middleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// ─── Protect: Verify JWT ──────────────────────────────────────────
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired. Please login again.', 401));
    }
    return next(new AppError('Invalid token. Please login again.', 401));
  }

  // Get user from token
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User associated with this token no longer exists.', 401));
  }

  // Check if user is active
  if (user.status !== 'active') {
    return next(new AppError('Your account has been suspended. Contact admin.', 403));
  }

  // Attach user to request
  req.user = user;
  next();
});

// ─── Authorize: Role-Based Access ────────────────────────────────
// Usage: authorize('admin', 'superadmin') or authorize('teacher', 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Role '${req.user.role}' is not authorized for this action.`,
          403
        )
      );
    }
    next();
  };
};

// ─── Optional Auth: Attach user if token present ─────────────────
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch {
      // Non-fatal — just no user attached
    }
  }
  next();
});

module.exports = { protect, authorize, optionalAuth };