const asyncHandler = require('express-async-handler');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Public
const createAppointment = asyncHandler(async (req, res) => {
  const { userId, doctorId, date, timeSlot, reason, symptoms, notes, drivingLink } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

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

  const appointment = await Appointment.create({
    user: userId,
    doctor: doctorId,
    date,
    timeSlot,
    reason,
    symptoms,
    notes,
    drivingLink,
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
});

// @desc    Get appointments by user ID
// @route   GET /api/appointments/user/:userId
// @access  Public
const getAppointmentsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const appointments = await Appointment.find({ user: userId })
    .sort({ date: -1 })
    .populate({
      path: 'doctor',
      select: '-password -__v'  // Exclude sensitive doctor fields
    }).populate({

      path: 'user',
    });


  res.status(200).json(appointments);
});


// @desc    Get appointments by doctor ID
// @route   GET /api/appointments/doctor/:doctorId
// @access  Public
const getAppointmentsByDoctorId = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;
  const appointments = await Appointment.find({ doctor: doctorId })
    .sort({ date: -1 }).populate({
      path: 'doctor',
      select: '-password -__v'  // Exclude sensitive doctor fields
    }).populate({

      path: 'user',
    });;
  res.json(appointments);a
});

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Public
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .sort({ date: -1 })
    .populate({
      path: 'doctor',
      select: '-password -__v'  // Exclude sensitive doctor fields
    })
    .populate({
      path: 'user',
    });;
  ;

  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Public
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    const {
      date,
      timeSlot,
      reason,
      symptoms,
      notes,
      status,
      prescriptions,
      drivingLink,
    } = req.body;

    appointment.date = date || appointment.date;
    appointment.timeSlot = timeSlot || appointment.timeSlot;
    appointment.reason = reason || appointment.reason;
    appointment.symptoms = symptoms || appointment.symptoms;
    appointment.notes = notes || appointment.notes;
    appointment.status = status || appointment.status;
    appointment.prescriptions = prescriptions || appointment.prescriptions;
    appointment.drivingLink = drivingLink || appointment.drivingLink;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Public
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    await Appointment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Appointment removed' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
// @access  Public
const getAllAppointments = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Appointment.countDocuments();
  const appointments = await Appointment.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    appointments,
  });
});

module.exports = {
  createAppointment,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
};
