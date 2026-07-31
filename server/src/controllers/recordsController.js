const recordsService = require('../services/recordsService');

const recordsController = {
  getRecords: async (req, res, next) => {
    try {
      const { userId } = req.query;
      console.log(`[DEBUG] Fetching records for userId: ${userId}`);

      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({
          success: false,
          error: 'Valid userId is required'
        });
      }

      const records = await recordsService.getUserRecords(parseInt(userId));

      res.status(200).json({
        success: true,
        data: records
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
