const asyncHandler = require('express-async-handler');
const Doctor = require('../models/doctorModel');

// @desc    Register new doctor
// @route   POST /api/doctors/register
// @access  Public
const registerDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    specialization,
    experience,
    fees,
    availableDays,
    availableTimeSlots,
    address, // ⬅️ Include this field from the request body
  } = req.body;

  // Check if doctor with the same email already exists
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    res.status(400);
    throw new Error('Doctor with this email already exists');
  }

  // Create doctor profile with address (required for geocoding)
  const doctor = await Doctor.create({
    name,
    email,
    password,
    phone,
    specialization,
    experience,
    fees,
    availableDays,
    availableTimeSlots,
    address, // ⬅️ Must be passed to trigger geocoding
  });

  if (doctor) {
    res.status(201).json(doctor);
  } else {
    res.status(400);
    throw new Error('Invalid doctor data');
  }
});


// @desc    Login doctor by email
// @route   POST /api/doctors/login
// @access  Public
const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });

  if (doctor && (await doctor.matchPassword(password))) {
    res.json({
      _id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getSpecializations = async()=>{
  try{
    const specializations = await Doctor.distinct("specialization");
    console.log("unique specializations : ", specializations);
  }catch(error){
    console.log("error : ",error.message);
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;         // Default to page 1
  const limit = Number(req.query.limit) || 10;      // Default to 10 doctors per page
  const skip = (page - 1) * limit;
  // getSpecializations();
  const { specialization } = req.query;

  // Build a filter object
  const filter = {};
  if (specialization) {
    filter.specialization = specialization;
  }

  const total = await Doctor.countDocuments(filter);      // Total number of doctors matching filter

  const doctors = await Doctor.find(filter)
    .skip(skip)
    .limit(limit);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    doctors,
  });
});



// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error('Doctor not found');
  }
});

// @desc    Update doctor by ID
// @route   PUT /api/doctors/:id
// @access  Public or Private (your choice)
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  const {
    name,
    email,
    phone,
    specialization,
    experience,
    fees,
    availableDays,
    availableTimeSlots,
  } = req.body;

  doctor.name = name || doctor.name;
  doctor.email = email || doctor.email;
  doctor.phone = phone || doctor.phone;
  doctor.specialization = specialization || doctor.specialization;
  doctor.experience = experience || doctor.experience;
  doctor.fees = fees || doctor.fees;
  doctor.availableDays = availableDays || doctor.availableDays;
  doctor.availableTimeSlots = availableTimeSlots || doctor.availableTimeSlots;

  const updatedDoctor = await doctor.save();
  res.json(updatedDoctor);
});

// @desc    Delete doctor by ID
// @route   DELETE /api/doctors/:id
// @access  Public or Private
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  await doctor.remove();
  res.json({ message: 'Doctor removed' });
});

module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
