const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Protect routes - check if user is authenticated
exports.protect = async (req, res, next) => {
  try {
    // Check if user session exists
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    // Find user by id stored in session
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      // Check if it's a doctor
      const doctor = await Doctor.findById(req.session.userId);
      
      if (!doctor) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route',
        });
      }
      
      req.doctor = doctor;
      req.role = 'doctor';
    } else {
      req.user = user;
      req.role = 'user';
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        error: `${req.role} role is not authorized to access this route`,
      });
    }
    next();
  };
};