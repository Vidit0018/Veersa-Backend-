const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const geocoder = require('../utils/geocoder'); // Make sure to import your geocoder

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDoctor: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Geocode address and add lat/lng
userSchema.pre('save', async function (next) {
  if (!this.isModified('address')) return next();
  
  try {
    const loc = await geocoder.geocode(this.address);
    
    if (loc && loc.length > 0) {
      this.latitude = loc[0].latitude;
      this.longitude = loc[0].longitude;
      
      console.log('User geocoding - Latitude:', this.latitude);
      console.log('User geocoding - Longitude:', this.longitude);
    } else {
      console.log('No geocoding results found for user address:', this.address);
    }
  } catch (error) {
    console.error('User geocoding error:', error);
    // Don't return the error to next() unless you want to prevent saving
    // If geocoding fails, we can still save the user without coordinates
    console.log('Continuing save without coordinates...');
  }
  
  next();
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;