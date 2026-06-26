const db = require('../db');

const arrivalService = {
  /**
   * Create a new arrival with transaction
   * Accepts new format with chatLog and triageSummary
   */
  async createArrival(arrivalData) {
    const { hospitalId, patientName, chatLog, triageSummary } = arrivalData;
    
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
      
      // Compute priority using rule-based logic
      const priority = this._computePriority(triageSummary, chatLog);
      
      // Compute suspected diagnosis using rule-based logic
      const suspectedDiagnosis = this._computeSuspectedDiagnosis(triageSummary, chatLog);
      
      // Insert arrival
      const insertQuery = `
        INSERT INTO arrivals (patient_name, hospital_id, priority, suspected_diagnosis, status)
        VALUES ($1, $2, $3, $4, 'waiting')
        RETURNING 
          id,
          patient_name,
          hospital_id,
          priority,
          suspected_diagnosis,
          status,
          arrived_at,
          created_at
      `;
      
      const result = await client.query(insertQuery, [
        patientName,
        hospitalId,
        priority,
        suspectedDiagnosis
      ]);
      
      const arrival = result.rows[0];
      const arrivalId = arrival.id;
      
      // Insert triage summary
      const triageInsertQuery = `
        INSERT INTO triage_summary (
          arrival_id,
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
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
      
      await client.query(triageInsertQuery, [
        arrivalId,
        triageSummary.symptoms || null,
        triageSummary.chronology || null,
        triageSummary.quality || null,
        triageSummary.quantity || triageSummary.severity || null,
        triageSummary.positiveModifiers || null,
        triageSummary.negativeModifiers || null,
        triageSummary.associatedSymptoms || null,
        triageSummary.previousHistory || null,
        triageSummary.familyHistory || null,
        triageSummary.currentMedication || null,
        triageSummary.otherNotes || null
      ]);
      
      // Insert chat messages
      for (const msg of chatLog) {
        const chatInsertQuery = `
          INSERT INTO chat_messages (arrival_id, sender, message, timestamp)
          VALUES ($1, $2, $3, $4)
        `;
        
        await client.query(chatInsertQuery, [
          arrivalId,
          msg.sender,
          msg.message,
          msg.timestamp
        ]);
      }
      
      await client.query('COMMIT');
      
      // Recalculate queue for this hospital (this will compute ETA)
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
   * Compute priority based on triage summary and chat log
   * Rule-based logic (placeholder for AI)
   * Priority: 1 (critical) to 5 (non-urgent)
   */
  _computePriority(triageSummary, chatLog) {
    const symptoms = (triageSummary.symptoms || '').toLowerCase();
    const severity = (triageSummary.severity || triageSummary.quantity || '').toLowerCase();
    const associatedSymptoms = (triageSummary.associatedSymptoms || '').toLowerCase();
    
    // Critical keywords (Priority 1)
    const criticalKeywords = [
      'chest pain', 'heart attack', 'stroke', 'unconscious', 'not breathing',
      'severe bleeding', 'head injury', 'seizure', 'cardiac arrest'
    ];
    
    // Urgent keywords (Priority 2)
    const urgentKeywords = [
      'shortness of breath', 'difficulty breathing', 'severe pain',
      'broken bone', 'deep cut', 'high fever', 'severe burn'
    ];
    
    // Check for critical conditions
    for (const keyword of criticalKeywords) {
      if (symptoms.includes(keyword) || associatedSymptoms.includes(keyword)) {
        return 1;
      }
    }
    
    // Check severity rating
    if (severity.includes('10/10') || severity.includes('severe') || severity.includes('critical')) {
      return 1;
    }
    
    if (severity.includes('9/10') || severity.includes('8/10')) {
      return 2;
    }
    
    // Check for urgent conditions
    for (const keyword of urgentKeywords) {
      if (symptoms.includes(keyword) || associatedSymptoms.includes(keyword)) {
        return 2;
      }
    }
    
    // Check severity for moderate cases
    if (severity.includes('7/10') || severity.includes('6/10') || severity.includes('moderate')) {
      return 3;
    }
    
    // Check for less urgent cases
    if (severity.includes('5/10') || severity.includes('4/10') || severity.includes('mild')) {
      return 4;
    }
    
    // Default to non-urgent
    return 5;
  },

  /**
   * Compute suspected diagnosis based on triage summary and chat log
   * Rule-based logic (placeholder for AI)
   */
  _computeSuspectedDiagnosis(triageSummary, chatLog) {
    const symptoms = (triageSummary.symptoms || '').toLowerCase();
    const associatedSymptoms = (triageSummary.associatedSymptoms || '').toLowerCase();
    const allSymptoms = `${symptoms} ${associatedSymptoms}`;
    
    // Cardiac conditions
    if (allSymptoms.includes('chest pain') && 
        (allSymptoms.includes('shortness of breath') || allSymptoms.includes('sweating'))) {
      return 'Possible Acute Coronary Syndrome';
    }
    
    if (allSymptoms.includes('chest pain')) {
      return 'Chest Pain - Cardiac Evaluation Needed';
    }
    
    // Respiratory conditions
    if (allSymptoms.includes('shortness of breath') || allSymptoms.includes('difficulty breathing')) {
      return 'Respiratory Distress';
    }
    
    // Neurological conditions
    if (allSymptoms.includes('stroke') || allSymptoms.includes('facial drooping') || 
        allSymptoms.includes('slurred speech')) {
      return 'Possible Stroke';
    }
    
    if (allSymptoms.includes('headache') && allSymptoms.includes('severe')) {
      return 'Severe Headache - Neurological Assessment Needed';
    }
    
    // Trauma
    if (allSymptoms.includes('injury') || allSymptoms.includes('trauma') || 
        allSymptoms.includes('broken') || allSymptoms.includes('fracture')) {
      return 'Traumatic Injury';
    }
    
    // Abdominal conditions
    if (allSymptoms.includes('abdominal pain') || allSymptoms.includes('stomach pain')) {
      return 'Abdominal Pain - Further Assessment Needed';
    }
    
    // Infection/fever
    if (allSymptoms.includes('fever') || allSymptoms.includes('infection')) {
      return 'Possible Infection';
    }
    
    // Default
    return 'General Medical Assessment Needed';
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
