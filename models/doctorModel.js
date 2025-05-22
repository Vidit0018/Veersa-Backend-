const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const geocoder = require('../utils/geocoder'); // Still used to convert address

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add name'] },
    email: { type: String, required: [true, 'Please add email'], unique: true },
    password: { type: String, required: [true, 'Please add a password'] },
    phone: { type: String },
    specialization: { type: String, required: [true, 'Please add specialization'] },
    experience: { type: Number, required: [true, 'Please add years of experience'] },
    fees: { type: Number, required: [true, 'Please add consultation fees'] },
    availableDays: {
      type: [String],
      required: [true, 'Please add available days'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    availableTimeSlots: { type: [String], required: [true, 'Please add available time slots'] },
    address: { type: String, required: [true, 'Please add an address'] },
    latitude: { type: Number },
    longitude: { type: Number },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash password
doctorSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Geocode address and add lat/lng
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('address')) return next();
  
  try {
    const loc = await geocoder.geocode(this.address);
    
    if (loc && loc.length > 0) {
      this.latitude = loc[0].latitude;
      this.longitude = loc[0].longitude;
      
      // Now log after setting the values
      console.log('Latitude:', this.latitude);
      console.log('Longitude:', this.longitude);
    } else {
      console.log('No geocoding results found for address:', this.address);
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return next(error);
  }
  
  next();
});


// Match password method
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
