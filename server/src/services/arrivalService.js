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
  },

  /**
   * Get arrival details with triage summary and chat log
   * Formatted for React nurse dashboard
   */
  async getArrivalDetails(id) {
    const client = await db.getClient();
    
    try {
      // Get arrival
      const arrivalQuery = `
        SELECT 
          a.id,
          a.patient_name,
          a.hospital_id,
          h.name as hospital_name,
          a.priority,
          a.diagnosis,
          a.suspected_diagnosis,
          a.status,
          a.estimated_wait,
          a.eta,
          a.arrived_at,
          a.created_at
        FROM arrivals a
        JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.id = $1
      `;
      
      const arrivalResult = await client.query(arrivalQuery, [id]);
      
      if (arrivalResult.rows.length === 0) {
        return null;
      }
      
      const arrival = arrivalResult.rows[0];
      
      // Get triage summary
      const triageQuery = `
        SELECT 
          symptoms,
          chronology,
          quality,
          quantity,
          positive_modifiers,
          negative_modifiers,
          associated_symptoms,
          previous_history,
          family_history,
          current_medication,
          other_notes
        FROM triage_summary
        WHERE arrival_id = $1
      `;
      
      const triageResult = await client.query(triageQuery, [id]);
      const triageSummary = triageResult.rows[0] || {
        symptoms: '',
        chronology: '',
        quality: '',
        quantity: '',
        positive_modifiers: '',
        negative_modifiers: '',
        associated_symptoms: '',
        previous_history: '',
        family_history: '',
        current_medication: '',
        other_notes: ''
      };
      
      // Get chat log
      const chatQuery = `
        SELECT 
          sender,
          message,
          timestamp
        FROM chat_messages
        WHERE arrival_id = $1
        ORDER BY id ASC
      `;
      
      const chatResult = await client.query(chatQuery, [id]);
      const chatLog = chatResult.rows;
      
      // Format response to match React expectations
      return {
        id: `P${String(arrival.id).padStart(3, '0')}`,
        priority: arrival.priority,
        suspectedDiagnosis: arrival.suspected_diagnosis || arrival.diagnosis || 'Unknown',
        eta: arrival.eta || arrival.arrived_at,
        triageSummary: {
          symptoms: triageSummary.symptoms || '',
          chronology: triageSummary.chronology || '',
          quality: triageSummary.quality || '',
          quantity: triageSummary.quantity || '',
          positiveModifiers: triageSummary.positive_modifiers || '',
          negativeModifiers: triageSummary.negative_modifiers || '',
          associatedSymptoms: triageSummary.associated_symptoms || '',
          previousHistory: triageSummary.previous_history || '',
          familyHistory: triageSummary.family_history || '',
          currentMedication: triageSummary.current_medication || '',
          otherNotes: triageSummary.other_notes || ''
        },
        chatLog: chatLog
      };
    } finally {
      client.release();
    }
  },

  /**
   * Update arrival priority
   */
  async updatePriority(id, newPriority) {
    const client = await db.getClient();
    
    try {
      await client.query('BEGIN');
      
      // Update priority
      const updateQuery = `
        UPDATE arrivals
        SET priority = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING hospital_id
      `;
      
      const result = await client.query(updateQuery, [newPriority, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Arrival not found');
      }
      
      const hospitalId = result.rows[0].hospital_id;
      
      await client.query('COMMIT');
      
      // Recalculate queue for this hospital
      const queueService = require('./queueService');
      await queueService.recalculateQueue(hospitalId);
      
      return { success: true, hospitalId };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = arrivalService;
