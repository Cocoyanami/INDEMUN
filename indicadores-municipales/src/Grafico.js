import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Grafico = ({ datos, municipio }) => {
  const data = {
    labels: ['2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Valor del Indicador',
        data: datos,
        fill: false,
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>{municipio}</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default Grafico;
