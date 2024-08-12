import React from 'react';
import './EstadoIndicador.css';

const getColor = (value) => {
  switch (value) {
    case 1:
      return 'green';
    case 2:
      return 'yellow';
    case 3:
      return 'red';
    case 4:
      return 'white';
    case 5:
      return 'grey';
    default:
      return 'black';
  }
};

const EstadoIndicador = ({ datos, municipio, nombreIndicador, tipoIndicador }) => {
  return (
    <div className="estado-indicador-container">
      <h2>{municipio}</h2>
      <h3>{nombreIndicador}</h3>
      <h4>Tipo: {tipoIndicador}</h4>
      <table className="estado-indicador-table">
        <thead>
          <tr>
            <th>Año</th>
            <th>2020</th>
            <th>2021</th>
            <th>2022</th>
            <th>2023</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Estado</td>
            {datos.map((value, index) => (
              <td key={index} style={{ backgroundColor: getColor(value) }}></td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EstadoIndicador;
