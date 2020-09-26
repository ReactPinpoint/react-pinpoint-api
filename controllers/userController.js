const { User } = require('../sequelize/models');

const userController = {};

userController.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { user_id: res.locals.user_id } });
    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

userController.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ where: {} });
    res.locals.users = users;
    next();
  } catch (err) {
    next(err);
  }
}

userController.dropUser = async (req, res, next) => {
  // this just deletes all users for now	
  try {	
   User.destroy({ where: { where: { user_id: res.locals.user_id } } });	
   next();	
 } catch (err) {	
   next(err);	
 }
}

userController.dropUsers = async (req, res, next) => {
   // this just deletes all users for now	
   try {	
    User.destroy({ where: {} });	
    next();	
  } catch (err) {	
    next(err);	
  }
}

module.exports = userController;
