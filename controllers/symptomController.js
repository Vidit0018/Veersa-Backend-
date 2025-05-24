// controllers/symptomController.js
const geminiService = require('../services/geminiService');
const Consultation = require('../models/consultation');

const symptomController = {
  
  async analyzeSymptoms(req, res) {
    try {
      const { symptoms, userAge, userGender, medicalHistory, userId } = req.body;

      // Basic validation
      if (!symptoms || symptoms.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one symptom is required'
        });
      }

      if (!userAge || !userGender) {
        return res.status(400).json({
          success: false,
          message: 'Age and gender are required'
        });
      }

      // Check for emergency keywords
      const emergencyCheck = symptomController.checkEmergency(symptoms);

      if (emergencyCheck.isEmergency) {
        return res.json({
          success: true,
          isEmergency: true,
          recommendation: {
            recommendedSpecialist: "Emergency Room",
            urgencyLevel: "Emergency",
            reasoning: emergencyCheck.reason,
            precautionaryMeasures: ["Seek immediate emergency medical attention"],
            additionalNotes: "This appears to be a medical emergency",
            disclaimer: "Seek immediate emergency medical care."
          }
        });
      }

      // Get AI analysis
      const analysis = await geminiService.analyzeSymptoms(
        symptoms, 
        userAge, 
        userGender, 
        medicalHistory || []
      );

      // Save to database (optional)
      let consultationId = null;
      if (userId) {
        try {
          const consultation = new Consultation({
            userId,
            symptoms,
            userAge,
            userGender,
            medicalHistory: medicalHistory || [],
            aiRecommendation: analysis,
            timestamp: new Date()
          });
          const saved = await consultation.save();
          consultationId = saved._id;
        } catch (dbError) {
          console.error('Database save error:', dbError);
          // Continue without saving
        }
      }

      // Return response
      res.json({
        success: true,
        isEmergency: false,
        consultationId,
        recommendation: analysis
      });

    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze symptoms',
        recommendation: geminiService.getFallbackResponse()
      });
    }
  },

  checkEmergency(symptoms) {
    const emergencyKeywords = [
      'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 
      'severe bleeding', 'unconscious', 'severe head injury',
      'severe abdominal pain', 'severe allergic reaction'
    ];

    for (const symptom of symptoms) {
      const symptomText = (symptom.name || symptom).toLowerCase();
      for (const keyword of emergencyKeywords) {
        if (symptomText.includes(keyword)) {
          return {
            isEmergency: true,
            reason: `Emergency symptom detected: ${symptom.name || symptom}`
          };
        }
      }
    }
    return { isEmergency: false };
  },

  async getSymptoms(req, res) {
    const symptoms = [
      'Fever', 'Headache', 'Cough', 'Sore throat', 'Fatigue',
      'Chest pain', 'Shortness of breath', 'Nausea', 'Vomiting',
      'Diarrhea', 'Stomach ache', 'Back pain', 'Joint pain',
      'Dizziness', 'Rash', 'Weight loss', 'Weight gain'
    ];

    res.json({
      success: true,
      symptoms
    });
  }
};

module.exports = symptomController;