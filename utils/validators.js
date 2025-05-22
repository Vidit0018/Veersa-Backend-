// Helper function to validate email format
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number
exports.isValidPhone = (phone) => {
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

// Helper function to validate date format (YYYY-MM-DD)
exports.isValidDate = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  return true;
};

// Helper function to validate time format (HH:MM)
exports.isValidTime = (timeString) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(timeString);
};

// Helper function to validate time slot format
exports.isValidTimeSlot = (timeSlot) => {
  // Format: "HH:MM-HH:MM"
  const timeSlotRegex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;
  
  if (!timeSlotRegex.test(timeSlot)) return false;
  
  const [startTime, endTime] = timeSlot.split('-');
  
  // Convert to minutes for comparison
  const startMinutes = getMinutes(startTime);
  const endMinutes = getMinutes(endTime);
  
  // End time should be after start time
  return endMinutes > startMinutes;
};

// Helper function to convert HH:MM to minutes
function getMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper function to validate password strength
exports.isStrongPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};