const db = require('../db');

const hospitalService = {
  /**
   * Get all hospitals
   */
  async getAllHospitals() {
    const query = `
      SELECT 
        id,
        name,
        address,
        phone,
        latitude,
        longitude,
        created_at
      FROM hospitals
      ORDER BY name ASC
    `;
    
    const result = await db.query(query);
    return result.rows;
  },

  /**
   * Get hospital by ID
   */
  async getHospitalById(id) {
    const query = `
      SELECT 
        id,
        name,
        address,
        phone,
        latitude,
        longitude,
        created_at
      FROM hospitals
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get complete hospital dashboard data
   * Formatted for React nurse dashboard
   */
  async getDashboard(hospitalId) {
    const client = await db.getClient();
    
    try {
      // Verify hospital exists
      const hospitalCheck = await client.query(
        'SELECT id, name, address, phone FROM hospitals WHERE id = $1',
        [hospitalId]
      );
      
      if (hospitalCheck.rows.length === 0) {
        throw new Error('Hospital not found');
      }
      
      const hospital = hospitalCheck.rows[0];
      
      // Recalculate queue to ensure fresh ETA values
      const queueService = require('./queueService');
      await queueService.recalculateQueue(hospitalId);
      
      // Get occupancy
      const occupancyQuery = `
        SELECT 
          current_er_capacity,
          max_er_capacity,
          current_inpatient_capacity,
          max_inpatient_capacity
        FROM hospital_occupancy
        WHERE hospital_id = $1
      `;
      
      const occupancyResult = await client.query(occupancyQuery, [hospitalId]);
      const occupancyData = occupancyResult.rows[0] || {
        current_er_capacity: 0,
        max_er_capacity: 20,
        current_inpatient_capacity: 0,
        max_inpatient_capacity: 150
      };
      
      // Get all active arrivals for this hospital
      const arrivalsQuery = `
        SELECT 
          a.id,
          a.patient_name,
          a.priority,
          a.suspected_diagnosis,
          a.diagnosis,
          a.eta,
          a.estimated_wait,
          a.status,
          a.arrived_at
        FROM arrivals a
        WHERE a.hospital_id = $1 
          AND a.status IN ('waiting', 'in_treatment')
        ORDER BY a.priority ASC, a.arrived_at ASC
      `;
      
      const arrivalsResult = await client.query(arrivalsQuery, [hospitalId]);
      
      // Format patients for React (matching patientsData.json structure)
      const patients = arrivalsResult.rows.map(arrival => ({
        id: `P${String(arrival.id).padStart(3, '0')}`,
        priority: arrival.priority,
        suspectedDiagnosis: arrival.suspected_diagnosis || arrival.diagnosis || 'Unknown',
        eta: arrival.eta || arrival.arrived_at
      }));
      
      // Group patients by priority
      const queues = {
        priority1: patients.filter(p => p.priority === 1),
        priority2: patients.filter(p => p.priority === 2),
        priority3: patients.filter(p => p.priority === 3),
        priority4: patients.filter(p => p.priority === 4),
        priority5: patients.filter(p => p.priority === 5)
      };
      
      // Format occupancy for React
      const occupancy = {
        erBeds: {
          total: occupancyData.max_er_capacity,
          occupied: occupancyData.current_er_capacity,
          available: occupancyData.max_er_capacity - occupancyData.current_er_capacity
        },
        inpatientRooms: {
          total: occupancyData.max_inpatient_capacity,
          occupied: occupancyData.current_inpatient_capacity,
          available: occupancyData.max_inpatient_capacity - occupancyData.current_inpatient_capacity
        }
      };
      
      return {
        hospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          phone: hospital.phone
        },
        occupancy,
        patients,
        queues
      };
    } finally {
      client.release();
    }
  }
};

module.exports = hospitalService;
