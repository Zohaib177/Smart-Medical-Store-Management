const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    const payload = {
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    };

    if (err.details && process.env.NODE_ENV === 'development') {
      payload.details = err.details;
    }

    return res.status(err.statusCode).json(payload);
  }

  if (err && err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
      errorCode: 'DUPLICATE_RECORD',
    });
  }

  if (err && err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(409).json({
      success: false,
      message: 'This record is linked with another record and cannot be modified',
      errorCode: 'FOREIGN_KEY_CONFLICT',
    });
  }

  if (err && err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Database connection error',
      errorCode: 'DATABASE_CONNECTION_ERROR',
    });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
    });
  }

  const statusCode = err && err.statusCode ? err.statusCode : 500;
  const message = err && err.message ? err.message : 'Internal server error';

  const payload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    payload.stack = err && err.stack ? err.stack : undefined;
  }

  return res.status(statusCode).json(payload);
}

module.exports = errorHandler;
