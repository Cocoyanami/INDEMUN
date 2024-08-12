import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from './indemun2.png'; // Asegúrate de que la ruta sea correcta

const Home = () => {
  return (
    <div className="home-container">
      <img src={logo} alt="Descripción de la imagen" className="header-image" />
      <div className="card">
        <img src="img/mapas.png" alt="Mapa" />
        <div className="card-content">
          <h3>Indicadores en mapas</h3>
          <p>Consulta y contrasta el estatus de los indicadores de desempeño municipal a través de un mapa interactivo</p>
          <Link to="/mapa">
            <button>Entrar</button>
          </Link>
        </div>
      </div>
      <div className="card">
        <img src="img/numero.jpg" alt="Estadísticas" />
        <div className="card-content">
          <h3>Estadísticas de indicadores</h3>
          <p>Estadísticas por módulo y municipio de los indicadores de desempeño municipal a través de gráficos interactivos </p>
          <Link to="/estadisticas">
            <button>Entrar</button>
          </Link>
        </div>
      </div>
      <div className="card">
        <img src="img/otra.jpg" alt="Otra Información" />
        <div className="card-content">
          <h3>Otra información relevante</h3>
          <p>Universidades participantes, clasificación de indicadores, entre otros documentos</p>
          <Link to="/otra-informacion">
            <button>Entrar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
