const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
};

function getAccessTokenCookieOptions() {
  return {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  };
}

function getRefreshTokenCookieOptions() {
  return {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

module.exports = {
  cookieOptions,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
};
