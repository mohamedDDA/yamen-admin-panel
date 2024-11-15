const { v4: uuidv4 } = require('uuid');  // You can use uuid to generate unique ids
const Project = require('../models/Project'); // Adjust the path as needed

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      slogan,
      description,
      location,
      thumbnail,
      images,
      building_area,
      land_area,
      units,
      latitude,
      longitude,
      label,
    } = req.body;

    // Find the document where projects are stored
    const projectDoc = await Project.findOne();

    // Get the last project ID and increment it
    let newId = 1; // Default to 1 if no project exists
    if (projectDoc && projectDoc.projects.length > 0) {
      // Get the highest id from the current projects and increment by 1
      const lastProject = projectDoc.projects[projectDoc.projects.length - 1];
      newId = parseInt(lastProject.id) + 1;  // Increment the last project's id
    }

    // Create a new project instance
    const newProject = {
      id: newId.toString(),  // Set the new id
      title,
      slogan,
      description,
      location,
      thumbnail,
      images,
      building_area,
      land_area,
      units,
      latitude,
      longitude,
      label,
    };

    // If no project document exists, create one
    if (!projectDoc) {
      const newDoc = new Project({
        projects: [newProject],
      });
      await newDoc.save();
      return res.status(201).json(newDoc);
    } else {
      // If the document exists, push the new project to the 'projects' array
      projectDoc.projects.push(newProject);
      await projectDoc.save();
      return res.status(201).json(projectDoc);
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};


// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {
  const { projectId } = req.params; // Get projectId from the URL params

  try {
    // Log the projectId to see what we're querying for
    console.log(`Fetching project with id: ${projectId}`);

    // Find the document that contains the projects array and then search inside the array for the project with the matching id
    const projectDoc = await Project.findOne({
      "projects.id": projectId, // Search for the project in the array using the 'id' field
    });

    // If the document is found, filter out the specific project from the projects array
    if (projectDoc) {
      const project = projectDoc.projects.find(p => p.id === projectId);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.status(200).json(project); // Return the found project
    } else {
      return res.status(404).json({ message: 'Project not found' });
    }

  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const updatedData = req.body;

  try {
    // Find the document containing the projects array and update the specific project with the matching id
    const projectDoc = await Project.findOne();

    if (!projectDoc) {
      return res.status(404).json({ message: 'Project document not found' });
    }

    // Find the project inside the projects array and update it
    const project = projectDoc.projects.find(p => p.id === projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update the project with the new data
    Object.assign(project, updatedData);
    await projectDoc.save();

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const projectDoc = await Project.findOne();

    if (!projectDoc) {
      return res.status(404).json({ message: 'Project document not found' });
    }

    // Find the index of the project to delete
    const projectIndex = projectDoc.projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove the project from the projects array
    projectDoc.projects.splice(projectIndex, 1);
    await projectDoc.save();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};
