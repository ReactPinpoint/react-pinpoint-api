const { User } = require('../sequelize/models');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
  const invalidate = () => {
    res.locals.loggedIn = { loggedIn: false };
    res.clearCookie('token', { path: '/' });
    return next({ success: false, statusCode: 401, message: 'The email or password you entered is invalid.' });
  };

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      invalidate();
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      invalidate();
    }

    const validated = await user.validatePassword(password, user);
    if (!validated) {
      invalidate();
    }

    const payload = { user_id: user.user_id };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });
    } else {
      res.cookie('token', token, { httpOnly: true });
    }

    res.locals.loggedIn = { loggedIn: validated };
    return next();
  } catch (err) {
    return next({ statusCode: 400, message: err.message });
  }
};

module.exports = login;
