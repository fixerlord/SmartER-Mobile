const validatePatientId = (req, res, next) => {
  const { id, patientId } = req.params;
  const paramId = id || patientId;
  
  if (!paramId) {
    return res.status(400).json({
      success: false,
      error: 'Patient ID is required'
    });
  }
  next();
};

const validatePriority = (req, res, next) => {
  const { priority } = req.body;
  
  if (priority !== undefined) {
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 5) {
      return res.status(400).json({
        success: false,
        error: 'Priority must be between 1 and 5'
      });
    }
  }
  next();
};

module.exports = {
  validatePatientId,
  validatePriority
};
