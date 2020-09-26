const express = require('express');
const commitController = require('../controllers/commitController');

const router = express.Router();

router.get('/:project_id', 
  commitController.getCommit,
  (req, res) => res.status(200).json(res.locals.commits)
);

router.post('/:project_id', 
  commitController.addCommit,
  (req, res) => res.status(200).json(res.locals.commit)
);

module.exports = router;
