const TravelTimeProvider = require('./TravelTimeProvider');

/**
 * OSRM Travel Time Provider
 * 
 * Implementation using the public OSRM (Open Source Routing Machine) API
 * Documentation: http://project-osrm.org/docs/v5.24.0/api/
 */
class OSRMProvider extends TravelTimeProvider {
  constructor(config = {}) {
    super();
    this.baseUrl = config.baseUrl || 'https://router.project-osrm.org';
    this.timeout = config.timeout || 10000; // 10 seconds default
  }

  /**
   * Map travel mode to OSRM profile
   * 
   * @param {string} travelMode - 'driving', 'walking', or 'cycling'
   * @returns {string} OSRM profile name
   */
  _getOSRMProfile(travelMode) {
    const profileMap = {
      'driving': 'car',
      'walking': 'foot',
      'cycling': 'bike'
    };
    return profileMap[travelMode] || 'car';
  }

  /**
   * Calculate travel time using OSRM API
   * 
   * @param {number} startLat - Starting latitude
   * @param {number} startLon - Starting longitude
   * @param {number} endLat - Ending latitude
   * @param {number} endLon - Ending longitude
   * @param {string} travelMode - Mode of travel: 'driving', 'walking', or 'cycling'
   * @returns {Promise<{durationMinutes: number, distanceKm: number}>}
   * @throws {Error} If validation fails or API request fails
   */
  async getTravelTime(startLat, startLon, endLat, endLon, travelMode = 'driving') {
    // Validate inputs
    if (!this.isValidCoordinate(startLat, startLon)) {
      throw new Error(`Invalid start coordinates: (${startLat}, ${startLon})`);
    }
    if (!this.isValidCoordinate(endLat, endLon)) {
      throw new Error(`Invalid end coordinates: (${endLat}, ${endLon})`);
    }
    if (!this.isValidTravelMode(travelMode)) {
      throw new Error(`Invalid travel mode: ${travelMode}. Must be 'driving', 'walking', or 'cycling'`);
    }

    const profile = this._getOSRMProfile(travelMode);
    
    // OSRM expects coordinates in lon,lat format
    const coordinates = `${startLon},${startLat};${endLon},${endLat}`;
    const url = `${this.baseUrl}/route/v1/${profile}/${coordinates}?overview=false`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SMARTER-ER-App/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OSRM API returned status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Check OSRM response code
      if (data.code !== 'Ok') {
        throw new Error(`OSRM routing failed: ${data.code} - ${data.message || 'Unknown error'}`);
      }

      // Extract route information
      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found between the specified coordinates');
      }

      const route = data.routes[0];
      const durationSeconds = route.duration; // Duration in seconds
      const distanceMeters = route.distance; // Distance in meters

      // Convert to required units
      const durationMinutes = Math.round(durationSeconds / 60);
      const distanceKm = Math.round(distanceMeters / 1000 * 10) / 10; // Round to 1 decimal place

      return {
        durationMinutes,
        distanceKm
      };

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`OSRM API request timed out after ${this.timeout}ms`);
      }
      
      // Re-throw with context if it's already our error
      if (error.message.includes('OSRM') || error.message.includes('Invalid')) {
        throw error;
      }
      
      // Wrap network or other errors
      throw new Error(`Failed to calculate travel time via OSRM: ${error.message}`);
    }
  }
}

module.exports = OSRMProvider;
