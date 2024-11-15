// api/projects.js

const { getProjects, createProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectsController');

// Exporting the API handler
module.exports = async (req, res) => {
  switch (req.method) {
    case 'GET':
      if (req.query.id) {
        // If there's an ID in the query, fetch a single project
        return getProjectById(req, res);
      }
      // Otherwise, fetch all projects
      return getProjects(req, res);

    case 'POST':
      // Create a new project
      return createProject(req, res);

    case 'PUT':
      // Update an existing project
      if (!req.query.id) {
        return res.status(400).json({ message: 'ID is required to update a project.' });
      }
      return updateProject(req, res);

    case 'DELETE':
      // Delete a project by ID
      if (!req.query.id) {
        return res.status(400).json({ message: 'ID is required to delete a project.' });
      }
      return deleteProject(req, res);

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
  }
};
