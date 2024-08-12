import React, { useState } from 'react';
import './Legend.css';

const Legend = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`legend ${isOpen ? '' : 'closed'}`}>
      {isOpen ? (
        <>
          <div className="legend-header">
            <h4>Semaforización</h4>
            <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
              -
            </button>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'rgba(144, 232, 82, 0.8)' }}></div>
            <span>Óptimo</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'rgba(241, 255, 64, 0.8)' }}></div>
            <span>En Proceso</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'rgba(255, 0, 0, 0.8)' }}></div>
            <span>Rezago</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'rgba(255, 255, 255, 0.8)' }}></div>
            <span>No Medible</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: 'rgba(176, 176, 176, 0.8)' }}></div>
            <span>No Disponible</span>
          </div>
        </>
      ) : (
        <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
          +
        </button>
      )}
    </div>
  );
};

export default Legend;
