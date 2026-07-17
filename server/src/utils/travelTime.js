const { getTravelTimeProvider } = require('../services/travelTime');

/**
 * Travel Time Utility Functions
 * 
 * Convenience functions for calculating travel times in the application.
 * These functions use the configured TravelTimeProvider abstraction.
 */

/**
 * Calculate travel time between two coordinates
 * 
 * @param {number} startLat - Starting latitude
 * @param {number} startLon - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLon - Ending longitude
 * @param {string} travelMode - Mode of travel: 'driving', 'walking', or 'cycling'
 * @returns {Promise<{durationMinutes: number, distanceKm: number}>}
 */
async function calculateTravelTime(startLat, startLon, endLat, endLon, travelMode = 'driving') {
  const provider = getTravelTimeProvider();
  return await provider.getTravelTime(startLat, startLon, endLat, endLon, travelMode);
}

/**
 * Calculate travel time from patient location to hospital
 * 
 * @param {Object} patientLocation - Patient location {latitude, longitude}
 * @param {Object} hospital - Hospital object with latitude and longitude
 * @param {string} travelMode - Mode of travel: 'driving', 'walking', or 'cycling'
 * @returns {Promise<{durationMinutes: number, distanceKm: number}>}
 */
async function calculatePatientToHospitalTime(patientLocation, hospital, travelMode = 'driving') {
  if (!patientLocation || !patientLocation.latitude || !patientLocation.longitude) {
    throw new Error('Invalid patient location');
  }
  
  if (!hospital || !hospital.latitude || !hospital.longitude) {
    throw new Error('Invalid hospital location');
  }
  
  return await calculateTravelTime(
    patientLocation.latitude,
    patientLocation.longitude,
    hospital.latitude,
    hospital.longitude,
    travelMode
  );
}

/**
 * Calculate straight-line distance between two coordinates (Haversine formula)
 * Useful as a fallback when routing API is unavailable
 * 
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
function calculateStraightLineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 * 
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate travel time based on straight-line distance
 * Useful as a fallback when routing API is unavailable
 * 
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} travelMode - Mode of travel: 'driving', 'walking', or 'cycling'
 * @returns {number} Estimated duration in minutes
 */
function estimateTravelTimeFromDistance(distanceKm, travelMode = 'driving') {
  // Average speeds (km/h) - conservative estimates accounting for traffic, stops, etc.
  const averageSpeeds = {
    driving: 40,   // Urban driving with traffic
    walking: 5,    // Average walking pace
    cycling: 15    // Casual cycling pace
  };
  
  const speed = averageSpeeds[travelMode] || averageSpeeds.driving;
  const hours = distanceKm / speed;
  const minutes = Math.round(hours * 60);
  
  return minutes;
}

module.exports = {
  calculateTravelTime,
  calculatePatientToHospitalTime,
  calculateStraightLineDistance,
  estimateTravelTimeFromDistance
};
