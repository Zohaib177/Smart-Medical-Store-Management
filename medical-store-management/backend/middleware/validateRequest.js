const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  return next();
}

module.exports = validateRequest;
