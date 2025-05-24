// routes/symptoms.js
const express = require('express');
const symptomController = require('../controllers/symptomController');

const router = express.Router();

// Main route - analyze symptoms
router.post('/analyze', symptomController.analyzeSymptoms);

// Get available symptoms
router.get('/list', symptomController.getSymptoms);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Symptom service is running' 
  });
});

module.exports = router;