import React from 'react';
import './AppBar.css';

function AppBar({ nurseId, onLogout }) {
  return (
    <div className="app-bar">
      <div className="app-bar-left">
        <h1 className="app-name">SmartER</h1>
      </div>
      <div className="app-bar-right">
        <span className="nurse-id">Nurse ID: {nurseId}</span>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AppBar;
