import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import TotalesChart from './TotalesChart';
import 'chart.js/auto';
import './Estadisticas.css';
import { Select, Spin } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;

const Estadisticas = () => {
  const [data, setData] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState('');
  const [selectedModulo, setSelectedModulo] = useState('M1');
  const [activeTab, setActiveTab] = useState('indicadores');
  const [loading, setLoading] = useState(false);
  const [municipioOpen, setMunicipioOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/indicadores_modulo_2023')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeTab === 'indicadores') {
      setMunicipioOpen(true);
    } else {
      setMunicipioOpen(false);
    }
  }, [activeTab]);

  const handleMunicipioChange = (value) => {
    setSelectedMunicipio(value);
  };

  const handleModuloChange = (value) => {
    setSelectedModulo(value);
  };

  const selectedData = data.find(item => item.Municipio === selectedMunicipio);

  const labelsMap = {
    v: 'Óptimo',
    V: 'Óptimo',
    a: 'En Proceso',
    r: 'En Rezago',
    ndR: 'Rezago por no presentar información',
    nd: 'No disponible',
    nm: 'No medible'
  };

  const getLabel = (key) => {
    const suffix = key.split('_')[1];
    return labelsMap[suffix] || key;
  };

  const getChartData = () => {
    const labels = [];
    const values = [];
    const colors = ['rgba(144, 232, 82, 0.6)', 'rgba(241, 196, 15, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(139, 0, 0, 0.6)', 'rgba(169, 169, 169, 0.6)', 'rgba(148, 0, 211, 0.6)'];
    const borderColor = colors.map(color => color.replace('0.6', '1'));

    if (selectedData) {
      let colorIndex = 0;
      for (const key in selectedData) {
        if (key.startsWith(selectedModulo)) {
          labels.push(getLabel(key));
          values.push(selectedData[key]);
          colorIndex++;
        }
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: `Indicadores de ${selectedMunicipio} - ${selectedModulo}`,
          data: values,
          backgroundColor: colors,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
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
    <div className="estadisticas-container">
      <h2>Estadísticas</h2>
      <div className="tab-container">
        <button className={activeTab === 'indicadores' ? 'active' : ''} onClick={() => setActiveTab('indicadores')}>Indicadores 2023</button>
        <button className={activeTab === 'totales' ? 'active' : ''} onClick={() => setActiveTab('totales')}>Totales 2023</button>
      </div>
      {activeTab === 'indicadores' && (
        <div className="filters">
          <Select
            style={{ width: 200, marginRight: 10 }}
            onChange={handleMunicipioChange}
            placeholder="Selecciona un municipio"
            value={selectedMunicipio}
            open={municipioOpen}
            onDropdownVisibleChange={(open) => setMunicipioOpen(open)}
          >
            {data.map((item) => (
              <Option key={item.Municipio} value={item.Municipio}>{item.Municipio}</Option>
            ))}
          </Select>
          <Select
            style={{ width: 200 }}
            onChange={handleModuloChange}
            placeholder="Selecciona un módulo"
            value={selectedModulo}
          >
            <Option value="M1">M1: Organización</Option>
            <Option value="M2">M2: Hacienda</Option>
            <Option value="M3">M3: Gestión del Territorio</Option>
            <Option value="M4">M4: Servicios Públicos</Option>
            <Option value="M5">M5: Medio Ambiente</Option>
            <Option value="M6">M6: Desarrollo Social</Option>
            <Option value="M7">M7: Desarrollo Económico</Option>
            <Option value="M8">M8: Gobierno Abierto</Option>
          </Select>
        </div>
      )}
      {loading ? (
        <Spin tip="Loading...">
          <div style={{ height: '300px' }}></div>
        </Spin>
      ) : (
        <>
          {activeTab === 'indicadores' && selectedMunicipio && (
            <div className="chart-container">
              <Bar data={getChartData()} options={chartOptions} />
            </div>
          )}
          {activeTab === 'totales' && (
            <div className="chart-container">
              <TotalesChart />
            </div>
          )}
        </>
      )}
      <div className="bottom-left">
        <a href="/" className="back-button">Volver</a>
      </div>
    </div>
  );
};

export default Estadisticas;
