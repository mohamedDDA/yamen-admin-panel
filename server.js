const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas connection string (corrected to use yamenProjects database)
const dbUri = 'mongodb+srv://yamen:yamen123@cluster0.gsiu5.mongodb.net/yamenProjects?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Import the Project model
const Project = require('./models/Project');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// GET: Fetch all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch all projects from MongoDB
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Failed to retrieve projects', error: err.message });
  }
});

// GET: Fetch a single project by ID from the projects array
app.get('/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id; // Extract the project ID from the URL

    // Find the document that contains the 'projects' array and search inside it
    const projectDoc = await Project.findOne({
      'projects.id': projectId // Match the 'id' inside the projects array
    }).select('projects -_id'); // Exclude the '_id' field from the response

    // Check if the document was found
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project document not found' });
    }

    // Find the specific project inside the 'projects' array
    const projectData = projectDoc.projects.find(p => p.id === projectId);

    // Check if the specific project was found
    if (!projectData) {
      return res.status(404).json({ message: 'Project with the given id not found in the projects array' });
    }

    // Return the found project data (without the '_id' field)
    res.status(200).json(projectData);

  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ message: 'Failed to retrieve project', error: err.message });
  }
});


// POST: Create a new project
app.post('/projects', async (req, res) => {
  try {
    const newProject = new Project(req.body); // Create a new project from the request body
    await newProject.save(); // Save the project to MongoDB
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(400).json({ message: 'Failed to create project', error: err.message });
  }
});

// PUT: Update an existing project by ID
app.put('/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { 'projects.id': req.params.id },
      { $set: { 'projects.$': req.body } },
      { new: true }
    );
    if (updatedProject) {
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(400).json({ message: 'Failed to update project', error: err.message });
  }
});

// DELETE: Delete a project by ID
app.delete('/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.updateOne(
      { 'projects.id': req.params.id },
      { $pull: { projects: { id: req.params.id } } }
    );
    if (updatedProject.modifiedCount > 0) {
      res.status(200).json({ message: 'Project deleted' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
