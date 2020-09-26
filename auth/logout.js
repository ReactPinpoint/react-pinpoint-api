const logout = async (req, res, next) => {
  res.clearCookie('token');
  res.locals.loggedOut = { loggedOut: true };
  next();
}

module.exports = logout;
