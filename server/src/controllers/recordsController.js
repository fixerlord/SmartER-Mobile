const recordsService = require('../services/recordsService');

const recordsController = {
  getRecords: async (req, res, next) => {
    try {
      res.status(501).json({
        success: false,
        error: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  addRecord: async (req, res, next) => {
    try {
      res.status(501).json({
        success: false,
        error: 'Not implemented yet'
      });
    } catch (error) {
      next(error);
    }
  },

  getVitals: async (req, res, next) => {
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

module.exports = recordsController;
