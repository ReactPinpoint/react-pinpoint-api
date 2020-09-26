const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/',
  projectController.getProject,
  (req, res) => res.status(200).json(res.locals.projects)
);

router.post('/',
  projectController.addProject,
  (req, res) => res.status(200).json(res.locals.createdProject)
);

router.put('/',
  projectController.updateProject,
  (req, res) => res.status(200).json({})
);

router.delete('/',
  projectController.deleteProject,
  (req, res) => res.status(200).json({})
);

module.exports = router;
