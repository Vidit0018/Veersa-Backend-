const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add name'],
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    phone: {
      type: String,
    },
    specialization: {
      type: String,
      required: [true, 'Please add specialization'],
    },
    experience: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    fees: {
      type: Number,
      required: [true, 'Please add consultation fees'],
    },
    availableDays: {
      type: [String],
      required: [true, 'Please add available days'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    availableTimeSlots: {
      type: [String],
      required: [true, 'Please add available time slots'],
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add method to match password
doctorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
