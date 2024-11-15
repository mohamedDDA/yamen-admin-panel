const mongoose = require('mongoose');

// Define the project schema
const projectSchema = new mongoose.Schema({
  projects: [
    {
      id: { type: String, required: true, unique: true },
      title: {
        en: String,
        ar: String,
      },
      slogan: {
        en: String,
        ar: String,
      },
      description: {
        en: String,
        ar: String,
      },
      location: {
        en: String,
        ar: String,
      },
      thumbnail: String,
      images: [String],
      building_area: Number,
      land_area: Number,
      units: Number,
      latitude: Number,
      longitude: Number,
      label: { // label as an object with 'en' and 'ar' keys
        en: String,
        ar: String,
      },
    }
  ]
});


// Create a model
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
