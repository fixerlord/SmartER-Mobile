const arrivalService = require('../services/arrivalService');

const arrivalController = {
  /**
   * POST /api/arrivals
   * Create a new arrival
   */
  async createArrival(req, res, next) {
    try {
      const { patientName, hospitalId, priority, diagnosis } = req.body;
      
      // Validation
      if (!patientName || typeof patientName !== 'string' || patientName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Patient name is required and must be a non-empty string'
        });
      }
      
      if (patientName.length > 255) {
        return res.status(400).json({
          success: false,
          error: 'Patient name must not exceed 255 characters'
        });
      }
      
      if (!hospitalId || !Number.isInteger(hospitalId)) {
        return res.status(400).json({
          success: false,
          error: 'Hospital ID is required and must be an integer'
        });
      }
      
      if (!priority || !Number.isInteger(priority) || priority < 1 || priority > 5) {
        return res.status(400).json({
          success: false,
          error: 'Priority is required and must be an integer between 1 and 5'
        });
      }
      
      if (diagnosis && typeof diagnosis !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Diagnosis must be a string'
        });
      }
      
      if (diagnosis && diagnosis.length > 500) {
        return res.status(400).json({
          success: false,
          error: 'Diagnosis must not exceed 500 characters'
        });
      }
      
      // Create arrival
      const arrival = await arrivalService.createArrival({
        patientName: patientName.trim(),
        hospitalId,
        priority,
        diagnosis: diagnosis ? diagnosis.trim() : null
      });
      
      res.status(201).json({
        success: true,
        data: arrival
      });
    } catch (error) {
      if (error.message === 'Hospital not found') {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found'
        });
      }
      next(error);
    }
  },

  /**
   * GET /api/arrivals/:id
   * Get arrival by ID
   */
  async getArrivalById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: 'Invalid arrival ID'
        });
      }
      
      const arrival = await arrivalService.getArrivalById(parseInt(id));
      
      if (!arrival) {
        return res.status(404).json({
          success: false,
          error: 'Arrival not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: arrival
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/arrivals
   * Get all arrivals
   */
  async getAllArrivals(req, res, next) {
    try {
      const arrivals = await arrivalService.getAllArrivals();
      
      res.status(200).json({
        success: true,
        data: arrivals
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/arrivals/:id/details
   * Get arrival details with triage summary and chat log
   */
  async getArrivalDetails(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: 'Invalid arrival ID'
        });
      }
      
      const details = await arrivalService.getArrivalDetails(parseInt(id));
      
      if (!details) {
        return res.status(404).json({
          success: false,
          error: 'Arrival not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: details
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/arrivals/:id/priority
   * Update arrival priority
   */
  async updatePriority(req, res, next) {
    try {
      const { id } = req.params;
      const { priority } = req.body;
      
      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          error: 'Invalid arrival ID'
        });
      }
      
      if (!priority || !Number.isInteger(priority) || priority < 1 || priority > 5) {
        return res.status(400).json({
          success: false,
          error: 'Priority is required and must be an integer between 1 and 5'
        });
      }
      
      const result = await arrivalService.updatePriority(parseInt(id), priority);
      
      // Get updated dashboard data
      const hospitalService = require('../services/hospitalService');
      const dashboard = await hospitalService.getDashboard(result.hospitalId);
      
      res.status(200).json({
        success: true,
        message: 'Priority updated successfully',
        data: dashboard
      });
    } catch (error) {
      if (error.message === 'Arrival not found') {
        return res.status(404).json({
          success: false,
          error: 'Arrival not found'
        });
      }
      next(error);
    }
  }
};

module.exports = arrivalController;
