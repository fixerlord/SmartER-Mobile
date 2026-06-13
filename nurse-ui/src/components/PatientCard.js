import React from 'react';
import './PatientCard.css';

function PatientCard({ patient, onClick, onDragStart }) {
  const formatETA = (eta) => {
    const date = new Date(eta);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div
      className="patient-card"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
    >
      <div className="patient-card-header">
        <span className="patient-id">{patient.id}</span>
        <span className="patient-eta">ETA: {formatETA(patient.eta)}</span>
      </div>
      <div className="patient-diagnosis">
        {patient.suspectedDiagnosis}
      </div>
    </div>
  );
}

export default PatientCard;
