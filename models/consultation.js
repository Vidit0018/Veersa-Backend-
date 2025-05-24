// models/Consultation.js
const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  symptoms: [{
    name: String,
    severity: String
  }],
  userAge: {
    type: Number,
    required: true
  },
  userGender: {
    type: String,
    required: true
  },
  medicalHistory: [String],
  aiRecommendation: {
    recommendedSpecialist: String,
    urgencyLevel: String,
    reasoning: String,
    precautionaryMeasures: [String],
    additionalNotes: String,
    disclaimer: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Consultation', consultationSchema);