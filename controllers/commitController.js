const { Commit, Change, Project } = require('../sequelize/models');

const commitController = {};

commitController.getCommit = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    if (!project_id) return next({ err: 'Invalid project.' });
    const project = await Project.findByPk(project_id, {
      include: { all: true, nested: true },
    });
    if (!project)
      return next({ err: 'An error occured. Please try again later.' });
    const { changes } = project;
    res.locals.changes = changes;
    next();
  } catch (err) {
    next(err);
  }
};

commitController.addCommit = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const { changes } = req.body;

    // request validation
    if (!project_id) return next({ err: 'Invalid project.' });
    if (!changes) return next({ err: 'No changes sent.' });
    if (!changes.length) return next({ err: 'Changes length is zero.' });
    // console.log(changes)

    // loop through changes array and validate data
    for (let i = 0; i < changes.length; i += 1) {
      const commit = changes[i];
      console.log(commit);
      if (typeof commit !== 'object')
        return next({ err: 'Commit data is invalid.' });
      const {
        component_id,
        component_name,
        self_base_duration,
        parent_component_id,
        component_state,
        sibling_component_id,
      } = commit;
    }

    // if request data is validated then create the change and associate with project_id
    const change = await Change.create({});
    if (!change)
      return next({ err: 'An error occured. Please try again later.' });
    change.setProject(project_id);
    const { change_id } = change;
    
    // if change sucessfully created, create the commits and associate them with the change_id
    const commit_ids = [];
    for (let j = 0; j < changes.length; j += 1) {
      const {
        component_id,
        component_name,
        self_base_duration,
        parent_component_id,
        component_state,
        sibling_component_id,
        children_ids,
      } = changes[j];
      const commit = await Commit.create({
        component_id,
        component_name,
        self_base_duration,
        parent_component_id,
        component_state,
        sibling_component_id,
        children_ids,
      });
      commit.setChange(change_id);
      const { commit_id } = commit;
      commit_ids.push(commit_id);
    }

    // send data back to user
    res.locals.result = { change_id, commit_ids };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = commitController;
