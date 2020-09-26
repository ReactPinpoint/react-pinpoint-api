const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  const invalidate = () => {
    res.locals.loggedIn = { loggedIn: false };
    res.clearCookie('token');
  }
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.locals.loggedIn = { loggedIn: false };
      return next();
    }
    const user = await User.findOne({ where: { username } })
    if (!user) {
      invalidate();
      return next();
    }
    const validated = await user.validatePassword(password, user);
    if (!validated) {
      invalidate();
      return next();
    }
    const payload = { user_id: user.user_id }
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});
    res.cookie('token', token, { httpOnly: true });
    res.locals.loggedIn = { loggedIn: validated };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = login;
