const triageService = require('../services/triageService');

const triageController = {
  submitTriage: async (req, res, next) => {
    try {
      res.status(501).json({
        success: false,
        error: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  getTriageResponses: async (req, res, next) => {
    try {
      res.status(501).json({
        success: false,
        error: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  updatePriority: async (req, res, next) => {
    try {
      res.status(501).json({
        success: false,
        error: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = triageController;
