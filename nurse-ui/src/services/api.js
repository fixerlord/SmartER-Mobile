const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Hospital endpoints
  async getHospitals() {
    return this.request('/hospitals');
  }

  async getHospitalDashboard(hospitalId) {
    return this.request(`/hospitals/${hospitalId}/dashboard`);
  }

  // Arrival endpoints
  async getArrivalDetails(arrivalId) {
    // Extract numeric ID from "P001" format
    const numericId = parseInt(arrivalId.replace('P', ''));
    return this.request(`/arrivals/${numericId}/details`);
  }

  async updateArrivalPriority(arrivalId, priority) {
    // Extract numeric ID from "P001" format
    const numericId = parseInt(arrivalId.replace('P', ''));
    return this.request(`/arrivals/${numericId}/priority`, {
      method: 'PUT',
      body: JSON.stringify({ priority }),
    });
  }
}

const api = new ApiClient();
export default api;
