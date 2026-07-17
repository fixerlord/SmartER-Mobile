const OSRMProvider = require('./OSRMProvider');

/**
 * Travel Time Service Factory
 * 
 * Provides a configured instance of the travel time provider.
 * This abstraction allows swapping routing providers without changing controller code.
 */

let providerInstance = null;

/**
 * Get the configured travel time provider instance
 * 
 * @returns {TravelTimeProvider} Configured provider instance
 */
function getTravelTimeProvider() {
  if (!providerInstance) {
    // Default to OSRM provider
    // In the future, this could be configured via environment variables
    const providerType = process.env.TRAVEL_TIME_PROVIDER || 'osrm';
    
    switch (providerType.toLowerCase()) {
      case 'osrm':
        providerInstance = new OSRMProvider({
          baseUrl: process.env.OSRM_BASE_URL || 'https://router.project-osrm.org',
          timeout: parseInt(process.env.OSRM_TIMEOUT || '10000', 10)
        });
        break;
      
      // Future providers can be added here:
      // case 'google':
      //   providerInstance = new GoogleMapsProvider({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
      //   break;
      // case 'graphhopper':
      //   providerInstance = new GraphHopperProvider({ apiKey: process.env.GRAPHHOPPER_API_KEY });
      //   break;
      
      default:
        throw new Error(`Unknown travel time provider: ${providerType}`);
    }
  }
  
  return providerInstance;
}

/**
 * Reset the provider instance (useful for testing)
 */
function resetProvider() {
  providerInstance = null;
}

module.exports = {
  getTravelTimeProvider,
  resetProvider
};
