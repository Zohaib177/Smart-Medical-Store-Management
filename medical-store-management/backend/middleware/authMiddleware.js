const jwt = require('jsonwebtoken');
const adminModel = require('../models/Admin');
const ApiError = require('../utils/ApiError');
const authConstants = require('../constants/authConstants');
const asyncHandler = require('./asyncHandler');
const config = require('../config/environment');

const authenticateAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Access token is required', authConstants.authenticationErrorCodes.accessTokenMissing);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const admin = await adminModel.findById(decoded.sub);

    if (!admin) {
      throw new ApiError(401, 'Invalid access token', authConstants.authenticationErrorCodes.accessTokenInvalid);
    }

    if (admin.status === authConstants.inactiveAdminStatus) {
      throw new ApiError(403, 'Account is inactive', authConstants.authenticationErrorCodes.accountInactive);
    }

    if (admin.status === authConstants.blockedAdminStatus) {
      throw new ApiError(403, 'Account is blocked', authConstants.authenticationErrorCodes.accountBlocked);
    }

    req.admin = admin;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token has expired', authConstants.authenticationErrorCodes.accessTokenExpired);
    }

    throw new ApiError(401, 'Invalid access token', authConstants.authenticationErrorCodes.accessTokenInvalid);
  }
});

module.exports = authenticateAdmin;
