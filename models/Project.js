// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    en: String,
    ar: String
  },
  slogan: {
    en: String,
    ar: String
  },
  description: {
    en: String,
    ar: String
  },
  location: {
    en: String,
    ar: String
  },
  thumbnail: String,
  images: [String],
  building_area: Number,
  land_area: Number,
  units: Number,
  latitude: Number,
  longitude: Number,
  label: {
    en: String,
    ar: String
  }
});

module.exports = mongoose.model('Project', projectSchema);
