const TravelTimeProvider = require('./TravelTimeProvider');
const https = require('https');

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
   * Make HTTPS request using Node's https module (fallback for older Node versions)
   * 
   * @param {string} url - Full URL to request
   * @returns {Promise<Object>} Parsed JSON response
   */
  _makeHttpsRequest(url) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request timed out after ${this.timeout}ms`));
      }, this.timeout);

      https.get(url, {
        headers: {
          'User-Agent': 'SMARTER-ER-App/1.0'
        }
      }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          clearTimeout(timeoutId);
          
          if (res.statusCode !== 200) {
            reject(new Error(`OSRM API returned status ${res.statusCode}`));
            return;
          }

          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (error) {
            reject(new Error(`Failed to parse OSRM response: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    });
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
      // Use native fetch if available (Node 18+), otherwise use https module
      let data;
      
      if (typeof fetch !== 'undefined') {
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

        data = await response.json();
      } else {
        // Fallback for older Node versions
        data = await this._makeHttpsRequest(url);
      }

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
        const errorMsg = `OSRM API request timed out after ${this.timeout}ms`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Re-throw with context if it's already our error
      if (error.message.includes('OSRM') || error.message.includes('Invalid')) {
        console.error('OSRM error:', error.message);
        throw error;
      }
      
      // Wrap network or other errors with more details
      const errorMsg = `Failed to calculate travel time via OSRM: ${error.message}`;
      console.error(errorMsg, {
        url,
        startCoords: [startLat, startLon],
        endCoords: [endLat, endLon],
        travelMode,
        profile
      });
      throw new Error(errorMsg);
    }
  }
}

module.exports = OSRMProvider;
