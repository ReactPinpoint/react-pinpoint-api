const { Commit, Project } = require('../sequelize/models');

const commitController = {};

commitController.getCommit = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    if (!project_id) return next({ err: 'Invalid project.'});
    const project = await Project.findByPk(project_id, { include: Commit });
    const { commits } = project;
    console.log(project.commits)
    res.locals.commits = commits;
    next();
  } catch (err) {
    next(err);
  }
}

commitController.addCommit = async (req, res, next) => {
  try {
    //TODO write logic to post commit to DB
    const { project_id } = req.params;
    if (!project_id) return next({ err: 'Invalid project.'});
    const { 
      component_id, 
      component_name, 
      self_base_duration, 
      parent_component_id, 
      component_state, 
      sibling_component_id } = req.body;
    const commit = await Commit.create({
      component_id, 
      component_name, 
      self_base_duration, 
      parent_component_id, 
      component_state, 
      sibling_component_id
    })
    commit.setProject(project_id);
    res.locals.commit = commit;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = commitController;
