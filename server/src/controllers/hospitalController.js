const hospitalService = require('../services/hospitalService');

const hospitalController = {
  /**
   * GET /api/hospitals
   * Get all hospitals
   */
  async getAllHospitals(req, res, next) {
    try {
      const hospitals = await hospitalService.getAllHospitals();
      
      res.status(200).json({
        success: true,
        data: hospitals
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/hospitals/:id
   * Get hospital by ID
   */
  async getHospitalById(req, res, next) {
    try {
      const { id } = req.params;
      const hospital = await hospitalService.getHospitalById(id);
      
      if (!hospital) {
        return res.status(404).json({
          success: false,
          error: 'Hospital not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: hospital
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = hospitalController;
