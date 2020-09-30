const { User } = require('../sequelize/models');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return next('Invalid input.');
    const results = await User.findAll({ where: { username }});
    if (results.length) {
      res.locals.newUser = { err: 'User exists'};
      return next();
    }
    const user = await User.create({ username, password })
    const payload = { user_id: user.user_id }
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});
    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    res.locals.newUser = { user_id: user.user_id };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = register;
