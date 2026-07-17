const { getHospitalRecommendations } = require('../services/hospitalRecommendations');

const recommendationsController = {
  getRecommendations: async (req, res, next) => {
    try {
      const { lat, lon, travelMode } = req.query;

      // Validate required parameters
      if (!lat || !lon || !travelMode) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters: lat, lon, and travelMode are required'
        });
      }

      // Validate latitude
      const latitude = parseFloat(lat);
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        return res.status(400).json({
          success: false,
          error: 'Invalid latitude: must be a number between -90 and 90'
        });
      }

      // Validate longitude
      const longitude = parseFloat(lon);
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          error: 'Invalid longitude: must be a number between -180 and 180'
        });
      }

      // Validate travel mode
      const validTravelModes = ['driving', 'walking', 'cycling'];
      if (!validTravelModes.includes(travelMode)) {
        return res.status(400).json({
          success: false,
          error: `Invalid travelMode: must be one of ${validTravelModes.join(', ')}`
        });
      }

      // Get recommendations from service
      const recommendations = await getHospitalRecommendations(latitude, longitude, travelMode);

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = recommendationsController;
