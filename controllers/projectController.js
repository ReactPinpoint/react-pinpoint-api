const { User, Project } = require('../sequelize/models');

const projectController = {};

projectController.getProject = async (req, res, next) => {
  try {
    const user = await User.findByPk(res.locals.user_id, { include: Project });
    if (!user) return({ err: 'User not found.'});
    const { projects } = user;
    res.locals.projects = projects;
    next();
  } catch (err) {
    next(err);
  }
}

projectController.addProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ 
      name, 
      description,
    });
    project.setUser(res.locals.user_id);
    res.locals.createdProject = project;
    next();
  } catch (err) {
    next(err);
  }
}

projectController.updateProject = async (req, res, next) => {
  try {
    // TODO write logic to update project in DB
    next();
  } catch (err) {
    next(err);
  }
}

// deletes all projects for now
projectController.deleteProject = async (req, res, next) => {
  try {
    const result = Project.destroy({ where: {} });
    console.log(result)
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = projectController;
