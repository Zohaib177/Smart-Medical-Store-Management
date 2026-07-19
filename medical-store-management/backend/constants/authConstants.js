const authConstants = Object.freeze({
  accessTokenType: 'access',
  refreshTokenType: 'refresh',
  bearerPrefix: 'Bearer',
  activeAdminStatus: 'active',
  inactiveAdminStatus: 'inactive',
  blockedAdminStatus: 'blocked',
  authenticationErrorCodes: Object.freeze({
    invalidCredentials: 'INVALID_CREDENTIALS',
    accountInactive: 'ACCOUNT_INACTIVE',
    accountBlocked: 'ACCOUNT_BLOCKED',
    accessTokenMissing: 'ACCESS_TOKEN_MISSING',
    accessTokenInvalid: 'ACCESS_TOKEN_INVALID',
    accessTokenExpired: 'ACCESS_TOKEN_EXPIRED',
    refreshTokenMissing: 'REFRESH_TOKEN_MISSING',
    refreshTokenInvalid: 'REFRESH_TOKEN_INVALID',
    refreshTokenExpired: 'REFRESH_TOKEN_EXPIRED',
    sessionRevoked: 'SESSION_REVOKED',
    loginRateLimitExceeded: 'LOGIN_RATE_LIMIT_EXCEEDED',
  }),
});

module.exports = authConstants;
