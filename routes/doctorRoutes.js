const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctors,
  getDoctorById,
} = require('../controllers/doctorController');
// const { protect, doctor } = require('../middleware/authMiddleware');

router.route('/')
  .post(registerDoctor)
  .get(getDoctors);

router.route('/profile')
  .get( getDoctorProfile)
  .put( updateDoctorProfile);

router.route('/:id')
  .get(getDoctorById);

module.exports = router;