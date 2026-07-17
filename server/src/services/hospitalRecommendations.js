const db = require('../db');
const { getTravelTimeProvider } = require('./travelTime');

/**
 * Calculate total wait time for hospitals based on patient location
 * @param {number} patientLat - Patient latitude
 * @param {number} patientLon - Patient longitude
 * @param {string} travelMode - Travel mode: 'driving', 'walking', or 'cycling'
 * @returns {Promise<Array>} Sorted array of hospitals with wait time data
 */
async function getHospitalRecommendations(patientLat, patientLon, travelMode) {
  // Fetch all hospitals from database
  const result = await db.query(`
    SELECT 
      h.id,
      h.name,
      h.address,
      h.phone,
      h.latitude,
      h.longitude,
      h.created_at,
      COALESCE(
        (SELECT AVG(estimated_wait) 
         FROM arrivals 
         WHERE hospital_id = h.id 
         AND status IN ('waiting', 'in_treatment')
         AND estimated_wait IS NOT NULL),
        30
      ) as estimated_wait_minutes
    FROM hospitals h
    ORDER BY h.id
  `);

  const hospitals = result.rows;
  const provider = getTravelTimeProvider();
  
  // Calculate travel time for each hospital
  const hospitalsWithTravelData = await Promise.all(
    hospitals.map(async (hospital) => {
      try {
        const travelData = await provider.getTravelTime(
          patientLat,
          patientLon,
          hospital.latitude,
          hospital.longitude,
          travelMode
        );

        const estimatedWaitMinutes = Math.round(parseFloat(hospital.estimated_wait_minutes));
        const travelMinutes = travelData.durationMinutes;
        const totalWaitMinutes = estimatedWaitMinutes + travelMinutes;

        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          latitude: parseFloat(hospital.latitude),
          longitude: parseFloat(hospital.longitude),
          created_at: hospital.created_at,
          estimatedWaitMinutes: estimatedWaitMinutes,
          travelMinutes: travelMinutes,
          travelDistanceKm: travelData.distanceKm,
          totalWaitMinutes: totalWaitMinutes,
          travelDataAvailable: true
        };
      } catch (error) {
        // If travel time calculation fails for this hospital, include it with null travel data
        console.error(`Failed to calculate travel time for hospital ${hospital.id} (${hospital.name}):`, error.message);
        console.error('Hospital coordinates:', { lat: hospital.latitude, lon: hospital.longitude });
        console.error('Patient coordinates:', { lat: patientLat, lon: patientLon });
        console.error('Travel mode:', travelMode);
        
        const estimatedWaitMinutes = Math.round(parseFloat(hospital.estimated_wait_minutes));
        
        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone,
          latitude: parseFloat(hospital.latitude),
          longitude: parseFloat(hospital.longitude),
          created_at: hospital.created_at,
          estimatedWaitMinutes: estimatedWaitMinutes,
          travelMinutes: null,
          travelDistanceKm: null,
          totalWaitMinutes: null,
          travelDataAvailable: false
        };
      }
    })
  );

  // Sort by totalWaitMinutes (hospitals with unavailable travel data go to the end)
  hospitalsWithTravelData.sort((a, b) => {
    // If both have travel data, sort by totalWaitMinutes
    if (a.travelDataAvailable && b.travelDataAvailable) {
      return a.totalWaitMinutes - b.totalWaitMinutes;
    }
    // If only a has travel data, it comes first
    if (a.travelDataAvailable && !b.travelDataAvailable) {
      return -1;
    }
    // If only b has travel data, it comes first
    if (!a.travelDataAvailable && b.travelDataAvailable) {
      return 1;
    }
    // If neither has travel data, maintain original order (by id)
    return a.id - b.id;
  });

  return hospitalsWithTravelData;
}

module.exports = {
  getHospitalRecommendations
};
