const asyncHandler = require('express-async-handler');
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');

// @desc    Register doctor profile
// @route   POST /api/doctors
// @access  Private
const registerDoctor = asyncHandler(async (req, res) => {
  const { specialization, experience, fees, availableDays, availableTimeSlots } = req.body;

  // Check if doctor profile already exists
  const existingDoctor = await Doctor.findOne({ user: req.user._id });

  if (existingDoctor) {
    res.status(400);
    throw new Error('Doctor profile already exists');
  }

  // Create doctor profile
  const doctor = await Doctor.create({
    user: req.user._id,
    specialization,
    experience,
    fees,
    availableDays,
    availableTimeSlots,
  });

  // Update user to be a doctor
  await User.findByIdAndUpdate(req.user._id, { isDoctor: true });

  if (doctor) {
    res.status(201).json(doctor);
  } else {
    res.status(400);
    throw new Error('Invalid doctor data');
  }
});

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private/Doctor
const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone');

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error('Doctor profile not found');
  }
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private/Doctor
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id });

  if (doctor) {
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.experience = req.body.experience || doctor.experience;
    doctor.fees = req.body.fees || doctor.fees;
    doctor.availableDays = req.body.availableDays || doctor.availableDays;
    doctor.availableTimeSlots = req.body.availableTimeSlots || doctor.availableTimeSlots;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } else {
    res.status(404);
    throw new Error('Doctor profile not found');
  }
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({}).populate('user', 'name');
  res.json(doctors);
});

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone');

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

module.exports = {
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctors,
  getDoctorById,
};