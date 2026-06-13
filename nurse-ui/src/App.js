import React, { useState, useEffect } from 'react';
import './App.css';
import AppBar from './components/AppBar';
import TriageQueue from './components/TriageQueue';
import PatientReview from './components/PatientReview';
import HospitalOccupancy from './components/HospitalOccupancy';
import patientsData from './data/patientsData.json';

function App() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [hospitalOccupancy, setHospitalOccupancy] = useState(null);
  const [nurseId] = useState('NURSE-001'); // Placeholder nurse ID

  useEffect(() => {
    // Simulate fetching data from backend
    // In production, replace with actual API call
    setPatients(patientsData.patients);
    setHospitalOccupancy(patientsData.hospitalOccupancy);
  }, []);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseReview = () => {
    setSelectedPatient(null);
  };

  const handlePriorityChange = (patientId, newPriority) => {
    // Update patient priority
    // In production, this would be an API call
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === patientId
          ? { ...patient, priority: newPriority }
          : patient
      )
    );
  };

  const handleLogout = () => {
    // Implement logout logic
    alert('Logout functionality would be implemented here');
  };

  return (
    <div className="App">
      <AppBar nurseId={nurseId} onLogout={handleLogout} />
      <div className="main-content">
        <div className="dashboard-container">
          <TriageQueue
            patients={patients}
            onPatientClick={handlePatientClick}
            onPriorityChange={handlePriorityChange}
          />
          <HospitalOccupancy occupancy={hospitalOccupancy} />
        </div>
      </div>
      {selectedPatient && (
        <PatientReview
          patient={selectedPatient}
          onClose={handleCloseReview}
        />
      )}
    </div>
  );
}

export default App;
