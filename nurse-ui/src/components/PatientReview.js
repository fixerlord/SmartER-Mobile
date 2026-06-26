import React from 'react';
import './PatientReview.css';

const PRIORITY_NAMES = {
  1: 'Level 1 - Life-Threatening',
  2: 'Level 2 - Emergent',
  3: 'Level 3 - Urgent',
  4: 'Level 4 - Less Urgent',
  5: 'Level 5 - Non-Urgent'
};

const PRIORITY_COLORS = {
  1: '#000000',
  2: '#d32f2f',
  3: '#f57c00',
  4: '#fbc02d',
  5: '#7cb342'
};

function PatientReview({ patient, onClose }) {
  const formatETA = (eta) => {
    const date = new Date(eta);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div className="patient-review-overlay" onClick={onClose}>
      <div className="patient-review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="review-content">
          <div className="review-left">
            <div className="review-header">
              <h2 className="review-title">Patient Review</h2>
              <div className="review-actions">
                <button className="action-button message-button">
                  📱 Message Patient
                </button>
                <button className="action-button call-button">
                  📞 Call Patient
                </button>
              </div>
            </div>
            
            <div className="review-section">
              <div className="info-row">
                <span className="info-label">Patient ID:</span>
                <span className="info-value">{patient.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Triage Priority:</span>
                <span 
                  className="info-value priority-badge"
                  style={{ backgroundColor: PRIORITY_COLORS[patient.priority] }}
                >
                  {PRIORITY_NAMES[patient.priority]}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Suspected Diagnosis:</span>
                <span className="info-value">{patient.suspectedDiagnosis}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Estimated Time of Arrival:</span>
                <span className="info-value">{formatETA(patient.eta)}</span>
              </div>
            </div>

            <div className="review-section">
              <h3 className="section-title">Triage Summary</h3>
              
              {Array.isArray(patient.triageSummary?.fields) && patient.triageSummary.fields.length > 0 ? (
                // New dynamic format
                patient.triageSummary.fields.map((field, index) => (
                  <div key={index} className="summary-item">
                    <strong>{field.label}:</strong>
                    <p>{field.value}</p>
                  </div>
                ))
              ) : (
                // Fallback to old hardcoded format for backward compatibility
                <>
                  <div className="summary-item">
                    <strong>Symptoms:</strong>
                    <p>{patient.triageSummary.symptoms}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Chronology of Illness:</strong>
                    <p>{patient.triageSummary.chronology}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Quality of Illness:</strong>
                    <p>{patient.triageSummary.quality}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Quantity:</strong>
                    <p>{patient.triageSummary.quantity}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Positive Modifying Factors:</strong>
                    <p>{patient.triageSummary.positiveModifiers}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Negative Modifying Factors:</strong>
                    <p>{patient.triageSummary.negativeModifiers}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Associated Symptoms:</strong>
                    <p>{patient.triageSummary.associatedSymptoms}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Previous History:</strong>
                    <p>{patient.triageSummary.previousHistory}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Family History:</strong>
                    <p>{patient.triageSummary.familyHistory}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Current Medication:</strong>
                    <p>{patient.triageSummary.currentMedication}</p>
                  </div>

                  <div className="summary-item">
                    <strong>Other Notes:</strong>
                    <p>{patient.triageSummary.otherNotes}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="review-right">
            <h3 className="section-title">Triage Chat Log</h3>
            <div className="chat-log">
              {patient.chatLog.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.sender === 'bot' ? 'bot-message' : 'patient-message'}`}
                >
                  <div className="message-header">
                    <span className="message-sender">
                      {message.sender === 'bot' ? 'SmartER Bot' : 'Patient'}
                    </span>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-text">{message.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientReview;
