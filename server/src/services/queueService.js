const db = require('../db');

// Base estimated wait times in minutes by priority
const BASE_WAIT_TIMES = {
  1: 0,
  2: 10,
  3: 30,
  4: 60,
  5: 90
};

const queueService = {
  /**
   * Get queue for a specific hospital with calculated wait times and ETAs
   */
  async getHospitalQueue(hospitalId) {
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
      
      // Fetch all active arrivals for this hospital
      const arrivalsQuery = `
        SELECT 
          id,
          patient_name,
          priority,
          diagnosis,
          status,
          arrived_at
        FROM arrivals
        WHERE hospital_id = $1 
          AND status IN ('waiting', 'in_treatment')
        ORDER BY priority ASC, arrived_at ASC
      `;
      
      const arrivalsResult = await client.query(arrivalsQuery, [hospitalId]);
      const arrivals = arrivalsResult.rows;
      
      // Current time for ETA calculation
      const now = new Date();
      
      // Calculate estimated wait times and ETAs
      const queueWithWaitTimes = arrivals.map((arrival, index) => {
        // Base wait time for this priority
        const baseWait = BASE_WAIT_TIMES[arrival.priority] || 0;
        
        // Additional wait based on position in queue
        let additionalWait = 0;
        for (let i = 0; i < index; i++) {
          const priorArrival = arrivals[i];
          additionalWait += BASE_WAIT_TIMES[priorArrival.priority] || 0;
        }
        
        const estimatedWait = baseWait + additionalWait;
        
        // Calculate ETA as current time + estimated wait
        const eta = new Date(now.getTime() + estimatedWait * 60000); // Convert minutes to milliseconds
        
        return {
          id: arrival.id,
          estimatedWait: estimatedWait,
          eta: eta
        };
      });
      
      // Update estimated_wait AND eta in database
      for (const item of queueWithWaitTimes) {
        await client.query(
          'UPDATE arrivals SET estimated_wait = $1, eta = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [item.estimatedWait, item.eta, item.id]
        );
      }
      
      await client.query('COMMIT');
      
      // Return formatted queue data
      return arrivals.map((arrival, index) => ({
        arrivalId: arrival.id,
        patientName: arrival.patient_name,
        priority: arrival.priority,
        diagnosis: arrival.diagnosis,
        estimatedWait: queueWithWaitTimes[index].estimatedWait,
        eta: queueWithWaitTimes[index].eta
      }));
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  /**
   * Recalculate queue for a hospital (called after priority changes)
   */
  async recalculateQueue(hospitalId) {
    return await this.getHospitalQueue(hospitalId);
  }
};

module.exports = queueService;
