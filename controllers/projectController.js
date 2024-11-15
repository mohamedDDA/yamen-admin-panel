// controllers/projectsController.js

const Project = require('../models/Project');

// GET: Fetch all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects from MongoDB
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Failed to retrieve projects', error: err.message });
  }
};

// GET: Fetch a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id); // Fetch a specific project by ID
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ message: 'Failed to retrieve project', error: err.message });
  }
};

// POST: Create a new project
exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body); // Create a new project from the request body
    await newProject.save(); // Save the project to MongoDB
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ message: 'Failed to create project', error: err.message });
  }
};

// PUT: Update an existing project by ID
exports.updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(400).json({ message: 'Failed to update project', error: err.message });
  }
};

// DELETE: Delete a project by ID
exports.deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (deletedProject) {
      res.status(200).json({ message: 'Project deleted' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};
