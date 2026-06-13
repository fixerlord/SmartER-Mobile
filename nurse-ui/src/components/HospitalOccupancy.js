import React from 'react';
import './HospitalOccupancy.css';

function HospitalOccupancy({ occupancy }) {
  if (!occupancy) {
    return <div className="hospital-occupancy">Loading...</div>;
  }

  const calculatePercentage = (occupied, total) => {
    return Math.round((occupied / total) * 100);
  };

  const erPercentage = calculatePercentage(
    occupancy.erBeds.occupied,
    occupancy.erBeds.total
  );

  const inpatientPercentage = calculatePercentage(
    occupancy.inpatientRooms.occupied,
    occupancy.inpatientRooms.total
  );

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return '#d32f2f';
    if (percentage >= 75) return '#f57c00';
    return '#7cb342';
  };

  return (
    <div className="hospital-occupancy">
      <h2 className="occupancy-title">Hospital Occupancy</h2>
      
      <div className="occupancy-card">
        <h3 className="occupancy-subtitle">Emergency Room Beds</h3>
        <div className="occupancy-stats">
          <div className="stat-row">
            <span className="stat-label">Available:</span>
            <span className="stat-value available">{occupancy.erBeds.available}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Occupied:</span>
            <span className="stat-value">{occupancy.erBeds.occupied}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{occupancy.erBeds.total}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${erPercentage}%`,
              backgroundColor: getStatusColor(erPercentage)
            }}
          >
            <span className="progress-text">{erPercentage}%</span>
          </div>
        </div>
      </div>

      <div className="occupancy-card">
        <h3 className="occupancy-subtitle">Inpatient Rooms</h3>
        <div className="occupancy-stats">
          <div className="stat-row">
            <span className="stat-label">Available:</span>
            <span className="stat-value available">{occupancy.inpatientRooms.available}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Occupied:</span>
            <span className="stat-value">{occupancy.inpatientRooms.occupied}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{occupancy.inpatientRooms.total}</span>
          </div>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${inpatientPercentage}%`,
              backgroundColor: getStatusColor(inpatientPercentage)
            }}
          >
            <span className="progress-text">{inpatientPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalOccupancy;
