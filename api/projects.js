const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Create a new project
router.post('/', projectController.createProject);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get a project by ID
router.get('/:projectId', projectController.getProjectById);

// Update a project by ID
router.put('/:projectId', projectController.updateProject);

// Delete a project by ID
router.delete('/:projectId', projectController.deleteProject);

module.exports = router;
