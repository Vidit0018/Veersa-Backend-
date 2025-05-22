const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;