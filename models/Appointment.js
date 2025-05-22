const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please provide appointment date and time'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please provide a time slot'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Please provide a reason for the appointment'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from booking multiple appointments at the same time slot
AppointmentSchema.index(
  { user: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true }
);

// Prevent doctor from having multiple appointments at the same time slot
AppointmentSchema.index(
  { doctor: 1, appointmentDate: 1, timeSlot: 1 },
  { unique: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);