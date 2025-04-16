import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaIndicadores.css';

const TablaIndicadores = ({ year }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!year) return;

    axios.get(`http://localhost:5000/indicadores_modulo/${year}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [year]);

  return (
    <div className="tabla-indicadores-container">
      <h2>Tabla de Indicadores {year}</h2>
      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default TablaIndicadores;
