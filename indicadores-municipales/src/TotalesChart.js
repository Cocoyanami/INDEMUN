import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './TotalesChart.css';

const TotalesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/indicadores_modulo_2023')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  

  const getChartData = () => {
    const labels = data.map(item => item.Municipio);
    const datasets = [
      {
        label: 'Óptimo (V)',
        data: data.map(item => item.T_v),
        backgroundColor: 'green',
        borderColor: 'rgba(144, 232, 82, 1)',
        borderWidth: 1,
        hidden: false, // Visible por defecto
      },
      {
        label: 'En Proceso (a)',
        data: data.map(item => item.T_a),
        backgroundColor: 'rgba(241, 196, 15, 0.6)',
        borderColor: 'rgba(241, 196, 15, 1)',
        borderWidth: 1,
        hidden: true, 
      },
      {
        label: 'En Rezago (r)',
        data: data.map(item => item.T_r),
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
        hidden: true,
      },
      {
        label: 'Rezago por no presentar información (ndR)',
        data: data.map(item => item.T_ndR),
        backgroundColor: 'rgba(139, 0, 0, 0.6)',
        borderColor: 'rgba(139, 0, 0, 1)',
        borderWidth: 1,
        hidden: true, 
      },
      {
        label: 'No disponible (nd)',
        data: data.map(item => item.T_nd),
        backgroundColor: 'rgba(169, 169, 169, 0.6)',
        borderColor: 'rgba(169, 169, 169, 1)',
        borderWidth: 1,
        hidden: true, 
      },
      {
        label: 'No medible (nm)',
        data: data.map(item => item.T_nm),
        backgroundColor: 'rgba(148, 0, 211, 0.6)',
        borderColor: 'rgba(148, 0, 211, 1)',
        borderWidth: 1,
        hidden: true, 
      }
    ];

    return {
      labels,
      datasets
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10 
          }
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: '670px', width: '100%' }}>
      <h2>Totales por Municipio 2023</h2>
      <Bar data={getChartData()} options={chartOptions} />
    </div>
  );
};

export default TotalesChart;
