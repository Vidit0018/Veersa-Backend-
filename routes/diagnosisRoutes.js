const express = require('express');
const router = express.Router();
const { getSpecialistSuggestion } = require('../controllers/diagnosisController');

router.post('/diagnose', getSpecialistSuggestion);

module.exports = router;
