const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');  // Import the cors package
const projectRoutes = require('./api/projects');

// Initialize express app
const app = express();

// Enable CORS for all origins (Allow all domains to access the API)
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection string (MongoDB Atlas)
const dbUri = "mongodb+srv://yamen:yamen123@cluster0.gsiu5.mongodb.net/yamenProjects?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Routes for API
app.use('/api/projects', projectRoutes);

// Default route to serve the control panel HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
