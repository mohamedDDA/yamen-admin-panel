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

// Define a schema for projects
const projectSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  slogan: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  location: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  thumbnail: { type: String },
  images: [{ type: String }],
  building_area: { type: Number, required: true },
  land_area: { type: Number, required: true },
  units: { type: Number, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  label: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  }
});

// Create a model for the project schema
const Project = mongoose.model('Project', projectSchema);

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

// GET: Fetch a single project by ID
app.get('/projects/:id', async (req, res) => {
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
});

// DELETE: Delete a project by ID
app.delete('/projects/:id', async (req, res) => {
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
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
