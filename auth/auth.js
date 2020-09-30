const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const isAuthorized = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const user_id = await jwt.verify(
      token,
      process.env.SECRET,
      (err, decoded) => {
        if (err) return undefined;
        return decoded.user_id;
      }
    )
    if (!user_id) return next({ err: 'Not Authorized.' });
    const user = await User.findByPk(user_id);
    if (!user) return next({ err: 'Not Authorized.' });
    res.locals.user_id = user.user_id;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = isAuthorized;
