import React, { useState } from 'react';
import './TriageQueue.css';
import PatientCard from './PatientCard';

const PRIORITY_LEVELS = [
  { level: 1, name: 'Life-Threatening', color: '#000000' },
  { level: 2, name: 'Emergent', color: '#d32f2f' },
  { level: 3, name: 'Urgent', color: '#f57c00' },
  { level: 4, name: 'Less Urgent', color: '#fbc02d' },
  { level: 5, name: 'Non-Urgent', color: '#7cb342' }
];

function TriageQueue({ patients, onPatientClick, onPriorityChange }) {
  const [expandedLevels, setExpandedLevels] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  const [draggedPatient, setDraggedPatient] = useState(null);

  const toggleLevel = (level) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  const getPatientsByPriority = (priority) => {
    return patients.filter(p => p.priority === priority);
  };

  const handleDragStart = (e, patient) => {
    setDraggedPatient(patient);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPriority) => {
    e.preventDefault();
    if (draggedPatient && draggedPatient.priority !== targetPriority) {
      onPriorityChange(draggedPatient.id, targetPriority);
    }
    setDraggedPatient(null);
  };

  return (
    <div className="triage-queue">
      <h2 className="queue-title">Triage Queue</h2>
      {PRIORITY_LEVELS.map(({ level, name, color }) => {
        const levelPatients = getPatientsByPriority(level);
        const isExpanded = expandedLevels[level];

        return (
          <div
            key={level}
            className="priority-section"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, level)}
          >
            <div
              className="priority-header"
              style={{ backgroundColor: color }}
              onClick={() => toggleLevel(level)}
            >
              <div className="priority-info">
                <span className="priority-level">Level {level}</span>
                <span className="priority-name">{name}</span>
                <span className="patient-count">({levelPatients.length})</span>
              </div>
              <span className="expand-icon">
                {isExpanded ? '▼' : '▶'}
              </span>
            </div>
            {isExpanded && (
              <div className="patients-container">
                {levelPatients.length === 0 ? (
                  <div className="no-patients">No patients in this category</div>
                ) : (
                  levelPatients.map(patient => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onClick={() => onPatientClick(patient)}
                      onDragStart={(e) => handleDragStart(e, patient)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TriageQueue;
