const db = require('../db');

const recordsService = {
  /**
   * Get all ER visit records for a specific user
   */
  async getUserRecords(userId) {
    const query = `
      SELECT
        a.id,
        a.patient_name,
        a.hospital_id,
        h.name as hospital_name,
        a.priority,
        a.suspected_diagnosis,
        a.diagnosis,
        a.status,
        a.arrived_at,
        a.created_at
      FROM arrivals a
      JOIN hospitals h ON a.hospital_id = h.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }
};

module.exports = recordsService;
