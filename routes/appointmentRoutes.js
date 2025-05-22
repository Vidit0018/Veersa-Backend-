// const express = require('express');
// const router = express.Router();
// const {
//   createAppointment,
//   getMyAppointments,
//   getDoctorAppointments,
//   getAppointmentById,
//   updateAppointment,
//   deleteAppointment,
//   getAppointments,
// } = require('../controllers/appointmentController');
// const { protect, admin, doctor } = require('../middleware/authMiddleware');

// router.route('/')
//   .post(protect, createAppointment)
//   .get(protect, admin, getAppointments);

// router.route('/my').get(protect, getMyAppointments);
// router.route('/doctor').get(protect, doctor, getDoctorAppointments);

// router
//   .route('/:id')
//   .get(protect, getAppointmentById)
//   .put(protect, updateAppointment)
//   .delete(protect, deleteAppointment);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointments,
} = require('../controllers/appointmentController');

router.route('/')
  .post(createAppointment)
  .get(getAppointments);

router.route('/my').get(getMyAppointments);
router.route('/doctor').get(getDoctorAppointments);

router
  .route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
