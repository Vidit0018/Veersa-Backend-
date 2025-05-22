const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor',
    },
    date: {
      type: Date,
      required: [true, 'Please add appointment date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please add appointment time slot'],
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Please add reason for appointment'],
    },
    symptoms: {
      type: String,
      required: [true, 'Please describe your symptoms'],
    },
    notes: {
      type: String,
    },
    prescriptions: [{
      medicine: {
        type: String,
      },
      dosage: {
        type: String,
      },
      duration: {
        type: String,
      }
    }],
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;