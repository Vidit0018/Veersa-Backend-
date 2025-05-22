const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Doctor = require('../models/doctorModel'); // Adjust if needed

const insertDoctorsFromJSON = async () => {
  try {
    console.log("inside function to mount dataset");
    // Navigate from utils/ to dataset/
    const filePath = path.join(__dirname, '../dataset/doctors_dataset.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const doctors = JSON.parse(data);

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedDoctors = await Promise.all(
      doctors.map(async (doc) => ({
        ...doc,
        password: await bcrypt.hash(doc.password, salt),
      }))
    );

    // Insert into DB
    await Doctor.insertMany(hashedDoctors);
    console.log('✅ All doctors inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting doctors:', error.message);
  }
};

module.exports = insertDoctorsFromJSON;

