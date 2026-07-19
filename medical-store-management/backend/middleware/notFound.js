const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, 'Route not found', 'ROUTE_NOT_FOUND', { path: req.originalUrl }));
}

module.exports = notFound;
