const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next({ statusCode: 400, message: `The email and password field is required.` });
    }

    if (process.env.NODE_ENV === 'production') {
      if (password.length < 8) {
        return next({ statusCode: 400, message: `The password must be at least 8 characters long.` });
      }

      if (password.length > 64) {
        return next({ statusCode: 400, message: `The password cannot be more than 64 characters long.` });
      }
    }

    const results = await User.findAll({ where: { username } });

    if (results.length) {
      return next({ statusCode: 409, message: `An account with this email already exists.` });
    }

    const user = await User.create({ username, password });

    if (!user) {
      return next({ message: 'There was an error. Please try again later.' });
    }

    const payload = { user_id: user.user_id };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    } else {
      res.cookie('token', token, { httpOnly: true });
    }

    res.locals.newUser = { user_id: user.user_id };
    return next();
  } catch (err) {
    return next({ statusCode: 400, message: err.message });
  }
};

module.exports = register;
