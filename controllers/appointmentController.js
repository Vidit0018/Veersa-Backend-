const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, timeSlot, reason, symptoms, notes } = req.body;

  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check if time slot is available
  const appointmentDate = new Date(date);
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date: {
      $gte: new Date(appointmentDate.setHours(0, 0, 0)),
      $lt: new Date(appointmentDate.setHours(23, 59, 59)),
    },
    timeSlot,
    status: { $nin: ['cancelled'] },
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  // Create the appointment
  const appointment = await Appointment.create({
    user: req.user._id,
    doctor: doctorId,
    date,
    timeSlot,
    reason,
    symptoms,
    notes,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
});

// @desc    Get user appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate({
      path: 'doctor',
      select: 'specialization fees',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .sort({ date: -1 });

  res.json(appointments);
});

// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  // Find the doctor profile
  const doctor = await Doctor.findOne({ user: req.user._id });
  
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate('user', 'name email phone')
    .sort({ date: -1 });

  res.json(appointments);
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate({
      path: 'doctor',
      select: 'specialization fees',
      populate: {
        path: 'user',
        select: 'name'
      }
    });

  if (appointment) {
    // Check if the appointment belongs to the logged in user or doctor
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctorOfAppointment = doctor && doctor._id.toString() === appointment.doctor._id.toString();
    
    if (
      appointment.user._id.toString() === req.user._id.toString() ||
      isDoctorOfAppointment ||
      req.user.isAdmin
    ) {
      res.json(appointment);
    } else {
      res.status(401);
      throw new Error('Not authorized to access this appointment');
    }
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if the appointment belongs to the logged in user or doctor
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctorOfAppointment = doctor && doctor._id.toString() === appointment.doctor.toString();
    
    if (
      appointment.user.toString() === req.user._id.toString() ||
      isDoctorOfAppointment ||
      req.user.isAdmin
    ) {
      // If user is updating, they can only update certain fields
      if (appointment.user.toString() === req.user._id.toString()) {
        appointment.reason = req.body.reason || appointment.reason;
        appointment.symptoms = req.body.symptoms || appointment.symptoms;
        appointment.notes = req.body.notes || appointment.notes;
        
        // Users can only cancel appointments
        if (req.body.status === 'cancelled') {
          appointment.status = 'cancelled';
        }
      } else {
        // Doctors and admins can update all fields
        appointment.date = req.body.date || appointment.date;
        appointment.timeSlot = req.body.timeSlot || appointment.timeSlot;
        appointment.reason = req.body.reason || appointment.reason;
        appointment.symptoms = req.body.symptoms || appointment.symptoms;
        appointment.notes = req.body.notes || appointment.notes;
        appointment.status = req.body.status || appointment.status;
        
        // Only doctors can add prescriptions
        if (isDoctorOfAppointment && req.body.prescriptions) {
          appointment.prescriptions = req.body.prescriptions;
        }
      }

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(401);
      throw new Error('Not authorized to update this appointment');
    }
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if the appointment belongs to the logged in user or doctor
    const doctor = await Doctor.findOne({ user: req.user._id });
    const isDoctorOfAppointment = doctor && doctor._id.toString() === appointment.doctor.toString();
    
    if (
      appointment.user.toString() === req.user._id.toString() ||
      isDoctorOfAppointment ||
      req.user.isAdmin
    ) {
      await Appointment.deleteOne({ _id: req.params.id });
      res.json({ message: 'Appointment removed' });
    } else {
      res.status(401);
      throw new Error('Not authorized to delete this appointment');
    }
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('user', 'name email')
    .populate({
      path: 'doctor',
      select: 'specialization',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .sort({ date: -1 });
  
  res.json(appointments);
});

module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointments,
};