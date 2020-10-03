const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const isAuthorized = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    const user_id = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return undefined;
      return decoded.user_id;
    });

    if (!user_id) {
      return next({ statusCode: 401, message: 'You are not authorized to view this page.' });
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
