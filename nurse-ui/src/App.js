import React, { useState, useEffect } from 'react';
import './App.css';
import AppBar from './components/AppBar';
import TriageQueue from './components/TriageQueue';
import PatientReview from './components/PatientReview';
import HospitalOccupancy from './components/HospitalOccupancy';
import api from './services/api';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const [hospitalOccupancy, setHospitalOccupancy] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nurseId] = useState('NURSE-001');

  // Load hospitals on mount
  useEffect(() => {
    loadHospitals();
  }, []);

  // Load dashboard when hospital changes
  useEffect(() => {
    if (selectedHospitalId) {
      loadDashboard();
    }
  }, [selectedHospitalId]);

  const loadHospitals = async () => {
    try {
      const response = await api.getHospitals();
      setHospitals(response.data);
    } catch (err) {
      console.error('Failed to load hospitals:', err);
      setError('Failed to load hospitals');
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getHospitalDashboard(selectedHospitalId);
      setPatients(response.data.patients);
      setHospitalOccupancy(response.data.occupancy);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Failed to load dashboard data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    
    try {
      const response = await api.getArrivalDetails(patient.id);
      setSelectedPatientDetails(response.data);
    } catch (err) {
      console.error('Failed to load patient details:', err);
      setError('Failed to load patient details');
    }
  };

  const handleCloseReview = () => {
    setSelectedPatient(null);
    setSelectedPatientDetails(null);
  };

  const handlePriorityChange = async (patientId, newPriority) => {
    try {
      const response = await api.updateArrivalPriority(patientId, newPriority);
      
      // Reload dashboard with updated data
      setPatients(response.data.patients);
      setHospitalOccupancy(response.data.occupancy);
    } catch (err) {
      console.error('Failed to update priority:', err);
      setError('Failed to update patient priority');
    }
  };

  const handleHospitalChange = (hospitalId) => {
    setSelectedHospitalId(parseInt(hospitalId));
  };

  if (loading && patients.length === 0) {
    return (
      <div className="App">
        <AppBar 
          nurseId={nurseId} 
          hospitals={hospitals}
          selectedHospitalId={selectedHospitalId}
          onHospitalChange={handleHospitalChange}
        />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && patients.length === 0) {
    return (
      <div className="App">
        <AppBar 
          nurseId={nurseId}
          hospitals={hospitals}
          selectedHospitalId={selectedHospitalId}
          onHospitalChange={handleHospitalChange}
        />
        <div className="main-content">
          <div className="error-container">
            <div className="error-message">
              <h2>⚠️ Error</h2>
              <p>{error}</p>
              <button onClick={loadDashboard} className="retry-button">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <AppBar 
        nurseId={nurseId}
        hospitals={hospitals}
        selectedHospitalId={selectedHospitalId}
        onHospitalChange={handleHospitalChange}
      />
      <div className="main-content">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}
        <div className="dashboard-container">
          <TriageQueue
            patients={patients}
            onPatientClick={handlePatientClick}
            onPriorityChange={handlePriorityChange}
          />
          <HospitalOccupancy occupancy={hospitalOccupancy} />
        </div>
      </div>
      {selectedPatientDetails && (
        <PatientReview
          patient={selectedPatientDetails}
          onClose={handleCloseReview}
        />
      )}
    </div>
  );
}

export default App;
