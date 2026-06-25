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
  }
};

module.exports = hospitalService;
