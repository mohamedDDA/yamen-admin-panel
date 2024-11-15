const mongoose = require('mongoose');

// Define the individual project schema
const individualProjectSchema = new mongoose.Schema({
  id: { type: String, required: true },  // Unique ID for each project
  title: {
    en: { type: String },
    ar: { type: String }
  },
  slogan: {
    en: { type: String },
    ar: { type: String }
  },
  description: {
    en: { type: String },
    ar: { type: String }
  },
  location: {
    en: { type: String },
    ar: { type: String }
  },
  thumbnail: { type: String },
  images: [String],
  building_area: { type: Number },
  land_area: { type: Number },
  units: { type: Number },
  latitude: { type: Number },
  longitude: { type: Number },
  label: {
    en: { type: String },
    ar: { type: String }
  }
});

// Define the parent schema with the `projects` array
const projectSchema = new mongoose.Schema({
  projects: [individualProjectSchema]  // Array of individual projects
});

module.exports = mongoose.model('Project', projectSchema);
