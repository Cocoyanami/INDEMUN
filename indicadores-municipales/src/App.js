import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './Home';
import Mapa from './Mapa';
import Estadisticas from './Estadisticas';
import OtraInformacion from './OtraInformacion'; // Importar el nuevo componente
import './App.css';
import './Home.css';

const App = () => {
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <div className="app-container">
      {isHomePage && (
        <header>
          <h1>Sistema Hidalguense de indicadores de desempeño Municipal</h1>
          
        </header>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/otra-informacion" element={<OtraInformacion />} /> {/* Ruta para el nuevo componente */}
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
