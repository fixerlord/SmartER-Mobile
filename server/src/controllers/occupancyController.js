const occupancyService = require('../services/occupancyService');

const occupancyController = {
  getOccupancy: async (req, res, next) => {
    try {
      res.status(501).json({
        success: false,
        error: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  updateOccupancy: async (req, res, next) => {
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

module.exports = occupancyController;
