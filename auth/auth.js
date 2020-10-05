const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const isAuthorized = async (req, res, next) => {
  // Default to no user logged in
  req.session = null;
  req.user = null;

  // Helper method to clear a token and invoke the next middleware
  const clearTokenAndNext = () => {
    res.clearCookie('token');
    return next({ statusCode: 401, message: 'You are not authorized to view this page.' });
  };

  try {
    // Read the cookie named 'token' and bail out if it doesn't exist
    const { token } = req.cookies;
    if (!token) {
      return clearTokenAndNext();
    }

    // Verify the validity of the token
    const user_id = await jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        return clearTokenAndNext();
      }

      // Compare the token expiry (in seconds) to the current time (in milliseconds)
      // Bail out if the token has expired
      if (decodedToken.exp <= Date.now() / 1000) {
        return clearTokenAndNext();
      }

      return decodedToken.user_id;
    });

    if (!user_id) {
      return clearTokenAndNext();
    }

    const user = await User.findByPk(user_id);

    if (!user) {
      return next({ statusCode: 401, message: 'You are not authorized to view this page.' });
    }

    res.locals.user_id = user.user_id;
    return next();
  } catch (err) {
    return next({ statusCode: 400, message: err.message });
  }
};

module.exports = isAuthorized;
