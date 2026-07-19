const adminModel = require('../models/Admin');
const adminRefreshTokenModel = require('../models/AdminRefreshToken');
const { comparePassword } = require('../services/passwordService');
const { signAccessToken, signRefreshToken, verifyRefreshToken, decodeToken } = require('../services/jwtService');
const { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } = require('../utils/cookieOptions');
const ApiError = require('../utils/ApiError');
const authConstants = require('../constants/authConstants');
const asyncHandler = require('../middleware/asyncHandler');

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, getAccessTokenCookieOptions());
  res.cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());
}

function clearAuthCookies(res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

function buildAdminResponse(admin) {
  return {
    id: admin.id,
    full_name: admin.full_name,
    email: admin.email,
    phone: admin.phone,
    profile_image: admin.profile_image,
    status: admin.status,
    last_login: admin.last_login,
  };
}

const loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const admin = await adminModel.findByEmail(email);

  if (!admin) {
    throw new ApiError(401, 'Invalid email or password', authConstants.authenticationErrorCodes.invalidCredentials);
  }

  if (admin.status === authConstants.inactiveAdminStatus) {
    throw new ApiError(403, 'Account is inactive', authConstants.authenticationErrorCodes.accountInactive);
  }

  if (admin.status === authConstants.blockedAdminStatus) {
    throw new ApiError(403, 'Account is blocked', authConstants.authenticationErrorCodes.accountBlocked);
  }

  const isPasswordValid = await comparePassword(password, admin.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password', authConstants.authenticationErrorCodes.invalidCredentials);
  }

  const accessToken = signAccessToken(admin);
  const refreshToken = signRefreshToken(admin);
  await adminRefreshTokenModel.createTokenRecord(admin.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  await adminModel.updateById(admin.id, { last_login: new Date() });

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json({
    success: true,
    message: 'Admin logged in successfully',
    data: {
      admin: buildAdminResponse(admin),
      accessToken,
    },
  });
});

const refreshAdminToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required', authConstants.authenticationErrorCodes.refreshTokenMissing);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, 'Refresh token is invalid', authConstants.authenticationErrorCodes.refreshTokenInvalid);
  }

  const admin = await adminModel.findById(decoded.sub);
  if (!admin) {
    throw new ApiError(401, 'Admin not found', authConstants.authenticationErrorCodes.refreshTokenInvalid);
  }

  const tokenRecord = await adminRefreshTokenModel.findActiveTokenRecord(admin.id, refreshToken);
  if (!tokenRecord) {
    throw new ApiError(401, 'Refresh token has been revoked', authConstants.authenticationErrorCodes.sessionRevoked);
  }

  const accessToken = signAccessToken(admin);
  const nextRefreshToken = signRefreshToken(admin);
  await adminRefreshTokenModel.revokeTokenRecord(admin.id, refreshToken);
  await adminRefreshTokenModel.createTokenRecord(admin.id, nextRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  setAuthCookies(res, accessToken, nextRefreshToken);

  return res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      admin: buildAdminResponse(admin),
      accessToken,
    },
  });
});

const logoutAdmin = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const decoded = decodeToken(refreshToken);
    if (decoded && decoded.sub) {
      await adminRefreshTokenModel.revokeAllForAdmin(decoded.sub);
    }
  }

  clearAuthCookies(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

const getAdminProfile = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: {
      admin: buildAdminResponse(req.admin),
    },
  });
});

module.exports = {
  loginAdmin,
  refreshAdminToken,
  logoutAdmin,
  getAdminProfile,
};
