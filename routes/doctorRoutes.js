const express = require('express');
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

router.post('/register', registerDoctor);
router.post('/login', loginDoctor);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
