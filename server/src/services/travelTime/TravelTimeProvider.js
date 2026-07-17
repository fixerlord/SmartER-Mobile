/**
 * TravelTimeProvider Interface
 * 
 * Abstract interface for calculating travel time between two coordinates.
 * Implementations should provide routing via different services (OSRM, Google Maps, etc.)
 */
class TravelTimeProvider {
  /**
   * Calculate travel time between two coordinates
   * 
   * @param {number} startLat - Starting latitude
   * @param {number} startLon - Starting longitude
   * @param {number} endLat - Ending latitude
   * @param {number} endLon - Ending longitude
   * @param {string} travelMode - Mode of travel: 'driving', 'walking', or 'cycling'
   * @returns {Promise<{durationMinutes: number, distanceKm: number}>}
   * @throws {Error} If the provider fails to calculate travel time
   */
  async getTravelTime(startLat, startLon, endLat, endLon, travelMode) {
    throw new Error('getTravelTime() must be implemented by subclass');
  }

  /**
   * Validate travel mode
   * 
   * @param {string} travelMode - Mode of travel to validate
   * @returns {boolean} True if valid
   */
  isValidTravelMode(travelMode) {
    const validModes = ['driving', 'walking', 'cycling'];
    return validModes.includes(travelMode);
  }

  /**
   * Validate coordinates
   * 
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {boolean} True if valid
   */
  isValidCoordinate(lat, lon) {
    return (
      typeof lat === 'number' &&
      typeof lon === 'number' &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    );
  }
}

module.exports = TravelTimeProvider;
