const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');

router.route('/').post(registerUser).get(getUsers);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);
router
  .route('/:id')
  .delete(deleteUser)
  .get(getUserById)
  .put(updateUser);

module.exports = router;
