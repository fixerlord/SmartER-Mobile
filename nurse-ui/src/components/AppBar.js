import React from 'react';
import './AppBar.css';

function AppBar({ nurseId, hospitals, selectedHospitalId, onHospitalChange }) {
  return (
    <div className="app-bar">
      <div className="app-bar-left">
        <h1 className="app-name">SmartER</h1>
      </div>
      <div className="app-bar-right">
        <div className="hospital-selector">
          <label htmlFor="hospital-select">Hospital: </label>
          <select 
            id="hospital-select"
            value={selectedHospitalId} 
            onChange={(e) => onHospitalChange(e.target.value)}
            className="hospital-dropdown"
          >
            {hospitals.map(hospital => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>
        <span className="nurse-id">Nurse ID: {nurseId}</span>
      </div>
    </div>
  );
}

export default AppBar;
