const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  async analyzeSymptoms(symptoms, userAge, userGender, medicalHistory = []) {
    try {
      const prompt = this.buildPrompt(symptoms, userAge, userGender, medicalHistory);
      
      const response = await axios.post(`${this.baseUrl}?key=${this.apiKey}`, {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.7,
          maxOutputTokens: 1000,
        }
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      return this.parseResponse(aiResponse);
      
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      return this.getFallbackResponse();
    }
  }

  buildPrompt(symptoms, age, gender, medicalHistory) {
    const symptomList = symptoms.map(s =>
      `- ${s.name || s}: ${s.severity || 'moderate'} severity`
    ).join('\n');

    return `
You are a medical triage assistant. Based on the patient’s symptoms, age, gender, and medical history, suggest the most appropriate medical specialist for further diagnosis or treatment.

Patient Information:
- Age: ${age}
- Gender: ${gender}
- Medical History: ${medicalHistory.length ? medicalHistory.join(', ') : 'None'}

Symptoms:
${symptomList}

Respond ONLY in this JSON format:
{
  "specialist": "Name of the appropriate medical specialist",
  "urgency": "Emergency | Urgent | Routine",
  "reason": "Brief explanation for this specialist choice",
  "precautions": ["advice1", "advice2", "advice3"],
  "notes": "Additional relevant guidance"
}
`;
  }

  parseResponse(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          recommendedSpecialist: parsed.specialist,
          urgencyLevel: this.validateUrgency(parsed.urgency),
          reasoning: parsed.reason || "Consultation recommended based on symptoms",
          precautionaryMeasures: Array.isArray(parsed.precautions) 
            ? parsed.precautions 
            : ["Consult with the recommended specialist"],
          additionalNotes: parsed.notes || "",
          disclaimer: "This is not a medical diagnosis. Please consult with a healthcare professional."
        };
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
    }

    return this.getFallbackResponse();
  }

  validateUrgency(urgency) {
    const validUrgencyLevels = ["Emergency", "Urgent", "Routine"];
    return validUrgencyLevels.includes(urgency) ? urgency : "Routine";
  }

  getFallbackResponse() {
    return {
      recommendedSpecialist: "General Medicine",
      urgencyLevel: "Routine",
      reasoning: "Unable to analyze symptoms properly. General consultation recommended.",
      precautionaryMeasures: [
        "Schedule appointment with a doctor",
        "Monitor your symptoms closely",
        "Seek immediate care if symptoms worsen"
      ],
      additionalNotes: "AI analysis was inconclusive. Please consult with a healthcare professional for proper evaluation.",
      disclaimer: "This is not a medical diagnosis. Please consult with a healthcare professional."
    };
  }
}

module.exports = new GeminiService();
