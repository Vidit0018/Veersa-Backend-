const axios = require('axios');
require('dotenv').config();

exports.getSpecialistSuggestion = async (req, res) => {
  const { symptoms, patientInfo, lang } = req.body;

  // Validate required fields
  if (
    !Array.isArray(symptoms) || symptoms.length === 0 ||
    !patientInfo || !patientInfo.age || !patientInfo.gender ||
    !patientInfo.height || !patientInfo.weight ||
    !patientInfo.medicalHistory || !patientInfo.currentMedications ||
    !patientInfo.allergies || !patientInfo.lifestyle
  ) {
    return res.status(400).json({
      message: "Insufficient details. Please provide all required patient and symptom information.",
    });
  }

  try {
    const response = await axios.post(
      'https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose?noqueue=1',
      {
        symptoms,
        patientInfo,
        lang: lang || "en"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        },
      }
    );

    const resultData = response.data;

    // Assuming API returns something like this:
    // { diagnosis: [...], suggestedSpecialist: "Neurologist" }
    const specialist = resultData?.suggestedSpecialist || resultData?.doctor || resultData?.recommendedDoctor;

    if (!specialist) {
      return res.status(200).json({
        message: "Doctor specialization not found in the response.",
        result: resultData
      });
    }

    res.status(200).json({
      recommendedDoctor: specialist
    });

  } catch (error) {
    console.error("RapidAPI Error:", error?.response?.data || error.message);
    res.status(500).json({
      message: "Diagnosis request failed. Try again later.",
      error: error?.response?.data || error.message,
    });
  }
};
