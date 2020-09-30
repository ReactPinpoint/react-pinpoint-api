const logout = async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') res.cookie('token', null, { httpOnly: true, sameSite: 'none', secure: true });
  else res.cookie('token', null, { httpOnly: true });
  res.locals.loggedOut = { loggedOut: true };
  next();
}

module.exports = logout;
