const db = require('../db');

const arrivalService = {
  /**
   * Create a new arrival with transaction
   */
  async createArrival(arrivalData) {
    const { patientName, hospitalId, priority, diagnosis } = arrivalData;
    
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Verify hospital exists
      const hospitalCheck = await client.query(
        'SELECT id FROM hospitals WHERE id = $1',
        [hospitalId]
      );
      
      if (hospitalCheck.rows.length === 0) {
        throw new Error('Hospital not found');
      }
      
      // Insert arrival
      const insertQuery = `
        INSERT INTO arrivals (patient_name, hospital_id, priority, diagnosis)
        VALUES ($1, $2, $3, $4)
        RETURNING 
          id,
          patient_name,
          hospital_id,
          priority,
          diagnosis,
          status,
          arrived_at,
          created_at
      `;
      
      const result = await client.query(insertQuery, [
        patientName,
        hospitalId,
        priority,
        diagnosis || null
      ]);
      
      await client.query('COMMIT');
      
      const arrival = result.rows[0];
      
      // Recalculate queue for this hospital
      const queueService = require('./queueService');
      await queueService.recalculateQueue(hospitalId);
      
      return arrival;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Get arrival by ID with hospital details
   */
  async getArrivalById(id) {
    const query = `
      SELECT 
        a.id,
        a.patient_name,
        a.hospital_id,
        h.name as hospital_name,
        a.priority,
        a.diagnosis,
        a.status,
        a.arrived_at,
        a.created_at
      FROM arrivals a
      JOIN hospitals h ON a.hospital_id = h.id
      WHERE a.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  /**
   * Get all arrivals
   */
  async getAllArrivals() {
    const query = `
      SELECT 
        a.id,
        a.patient_name,
        a.hospital_id,
        h.name as hospital_name,
        a.priority,
        a.diagnosis,
        a.status,
        a.arrived_at,
        a.created_at
      FROM arrivals a
      JOIN hospitals h ON a.hospital_id = h.id
      ORDER BY a.priority ASC, a.arrived_at ASC
    `;
    
    const result = await db.query(query);
    return result.rows;
  }
};

module.exports = arrivalService;
