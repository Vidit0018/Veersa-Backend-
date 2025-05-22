const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAllAppointments,
} = require('../controllers/appointmentController');

router.post('/', createAppointment);
router.get('/user/:userId', getAppointmentsByUserId);
router.get('/doctor/:doctorId', getAppointmentsByDoctorId);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/', getAllAppointments);

module.exports = router;
