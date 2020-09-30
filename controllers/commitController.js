const { Commit, Change, Project } = require('../sequelize/models');

const commitController = {};

commitController.getCommit = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    if (!project_id) return next({ err: 'Invalid project.'});
    const project = await Project.findByPk(project_id, { include: { all: true, nested: true } });
    // console.log(project)
    const { changes } = project;
    res.locals.changes = changes;
    next();
  } catch (err) {
    next(err);
  }
}

commitController.addCommit = async (req, res, next) => {
  try {
    const { project_id } = req.params;
    const { changes } = req.body;

    // request validation
    if (!project_id) return next({ err: 'Invalid project.'});
    if (!changes) return next({ err: 'No changes sent.' });
    if (!changes.length) return next({ err: 'Changes length is zero.'});
    // console.log(changes)

    // loop through changes array and validate data
    for (let i = 0; i < changes.length; i += 1) {
      const commit = changes[i];
      console.log(commit)
      if (typeof commit !== 'object') return next({ err: 'Commit data is invalid.'})
      const { 
        component_id, 
        component_name, 
        self_base_duration, 
        parent_component_id, 
        component_state, 
        sibling_component_id } = commit;
      if (!Object.hasOwnProperty.call(commit, 'component_id') || !component_id) return next({ err: 'component_id is missing.'});
      if (!Object.hasOwnProperty.call(commit, 'component_name') || !component_name) return next({ err: 'component_name is missing.'});
      if (!Object.hasOwnProperty.call(commit, 'self_base_duration') || !self_base_duration) return next({ err: 'self_base_duration is missing.'});
      if (!Object.hasOwnProperty.call(commit, 'parent_component_id') || !parent_component_id) return next({ err: 'parent_component_id is missing.'});
      if (!Object.hasOwnProperty.call(commit, 'component_state') || !component_state) return next({ err: 'component_state is missing.'});
      if (!Object.hasOwnProperty.call(commit, 'sibling_component_id') || !sibling_component_id) return next({ err: 'sibling_component_id is missing.'});
    }

    // if request data is validated then create the change and associate with project_id
    const change = await Change.create({});
    if (!change) return next({ err: "An error occured. Please try again later."});
    change.setProject(project_id);
    const { change_id } = change;
    // console.log('change_id ->',  change_id)
    // console.log('change ->', change);

    // if change sucessfully created, create the commits and associate them with the change_id
    const commit_ids = [];
    for (let j = 0; j < changes.length; j += 1) {
      const { 
        component_id, 
        component_name, 
        self_base_duration, 
        parent_component_id, 
        component_state, 
        sibling_component_id } = changes[j];
      const commit = await Commit.create({
        component_id, 
        component_name, 
        self_base_duration,
        parent_component_id, 
        component_state, 
        sibling_component_id
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
}

module.exports = commitController;
