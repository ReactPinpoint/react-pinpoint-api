const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return next('Invalid input.');
    const results = await User.findAll({ where: { username } });
    if (results.length) {
      res.locals.newUser = { err: `An account with this email already exists` };
      return next();
    }
    const user = await User.create({ username, password });
    if (!user) return next({ err: 'There was an error. Please try again later.' });
    const payload = { user_id: user.user_id };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    if (process.env.NODE_ENV === 'production') res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    else res.cookie('token', token, { httpOnly: true });
    res.locals.newUser = { user_id: user.user_id };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = register;
