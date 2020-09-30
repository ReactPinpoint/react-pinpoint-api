const express = require('express');
const commitController = require('../controllers/commitController');

const router = express.Router();

router.get('/:project_id', 
  commitController.getCommit,
  (req, res) => res.status(200).json(res.locals.changes)
);

router.post('/:project_id', 
  commitController.addCommit,
  (req, res) => res.status(200).json(res.locals.result)
);

module.exports = router;
