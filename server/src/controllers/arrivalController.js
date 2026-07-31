const arrivalService = require('../services/arrivalService');

const arrivalController = {
  /**
   * POST /api/arrivals
   * Create a new arrival
   */
  async createArrival(req, res, next) {
    try {
      const { hospitalId, userId, patientName, chatLog, triageSummary } = req.body;
      
      // Validate hospitalId
      if (!hospitalId || !Number.isInteger(hospitalId)) {
        return res.status(400).json({
          success: false,
          error: 'hospitalId is required and must be an integer'
        });
      }
      
      // Validate patientName
      if (!patientName || typeof patientName !== 'string' || patientName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'patientName is required and must be a non-empty string'
        });
      }
      
      if (patientName.length > 255) {
        return res.status(400).json({
          success: false,
          error: 'patientName must not exceed 255 characters'
        });
      }
      
      // Validate chatLog
      if (!chatLog || !Array.isArray(chatLog)) {
        return res.status(400).json({
          success: false,
          error: 'chatLog is required and must be an array'
        });
      }
      
      if (chatLog.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'chatLog must contain at least one message'
        });
      }
      
      // Validate each chat message
      for (let i = 0; i < chatLog.length; i++) {
        const msg = chatLog[i];
        if (!msg.sender || !msg.message || !msg.timestamp) {
          return res.status(400).json({
            success: false,
            error: `chatLog[${i}] must have sender, message, and timestamp fields`
          });
        }
        if (typeof msg.sender !== 'string' || typeof msg.message !== 'string' || typeof msg.timestamp !== 'string') {
          return res.status(400).json({
            success: false,
            error: `chatLog[${i}] fields must be strings`
          });
        }
      }
      
      // Validate triageSummary
      if (!triageSummary || typeof triageSummary !== 'object' || Array.isArray(triageSummary)) {
        return res.status(400).json({
          success: false,
          error: 'triageSummary is required and must be an object'
        });
      }
      
      // Validate triageSummary fields (all optional but must be strings if present)
      const validFields = [
        'fields', // Allow the new dynamic format
        'symptoms', 'chronology', 'quality', 'quantity', 'severity',
        'positiveModifiers', 'negativeModifiers', 'associatedSymptoms',
        'previousHistory', 'familyHistory', 'currentMedication', 'otherNotes'
      ];
      
      for (const [key, value] of Object.entries(triageSummary)) {
        if (!validFields.includes(key)) {
          return res.status(400).json({
            success: false,
            error: `Invalid triageSummary field: ${key}`
          });
        }
        // Skip string validation for the 'fields' array
        if (key === 'fields') continue;

        if (value !== null && value !== undefined && typeof value !== 'string') {
          return res.status(400).json({
            success: false,
            error: `triageSummary.${key} must be a string`
          });
        }
      }
      
      // Create arrival with new format
      const arrival = await arrivalService.createArrival({
        hospitalId,
        userId,
        patientName: patientName.trim(),
        chatLog,
        triageSummary
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
  },

  /**
   * GET /api/arrivals/latest
   * Get latest active arrival for the user
   */
  async getLatestArrival(req, res, next) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        });
      }

      const arrival = await arrivalService.getLatestActiveArrival(parseInt(userId));
      
      if (arrival) {
        arrival.test_from_controller = true;
        arrival.queue_position = 77;
        arrival.vitals = { heart_rate: 66, oxygen: 99, status: 'Stable' };
      }

      res.status(200).json({
        success: true,
        data: arrival
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = arrivalController;
