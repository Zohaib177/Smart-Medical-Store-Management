class ApiError extends Error {
  constructor(statusCode = 500, message = 'Internal server error', errorCode = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
