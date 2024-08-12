import React, { useState } from 'react';
import Modal from 'react-modal';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/antd.css';
import './OtraInformacion.css';

Modal.setAppElement('#root');

const OtraInformacion = () => {
  const [modalIsOpen, setModalIsOpen] = useState(null);
  const navigate = useNavigate();

  const openModal = (tab) => {
    setModalIsOpen(tab);
  };

  const closeModal = () => {
    setModalIsOpen(null);
  };

  const universidadesColumns = [
    {
      title: 'Municipio',
      dataIndex: 'municipio',
      key: 'municipio',
    },
    {
      title: 'Institución de educación superior',
      dataIndex: 'institucion',
      key: 'institucion',
    },
  ];

  const universidadesData = [
    { key: 1, municipio: 'Acatlán', institucion: 'Universidad Tecnológica de Tulancingo (UTEC)' },
    { key: 2, municipio: 'Acaxochitlán', institucion: 'Universidad Tecnológica de Tulancingo (UTEC)' },
    { key: 3, municipio: 'Actopan', institucion: 'Instituto Tecnológico Superior del Oriente del Estado de Hidalgo (ITESA)' },
    { key: 4, municipio: 'Agua Blanca de Iturbide', institucion: 'Universidad Tecnológica de Tulancingo (UTEC)' },
    { key: 5, municipio: 'Almoloya', institucion: 'Instituto Tecnológico Superior del Oriente del Estado de Hidalgo (ITESA)' },
    { key: 6, municipio: 'Apan', institucion: 'Universidad Politécnica de Pachuca (UPP)' },
    { key: 7, municipio: 'Atitalaquia', institucion: 'Universidad Tecnológica Tula-Tepejí (UTTT)' },
    { key: 8, municipio: 'Atlapexco', institucion: 'Universidad Tecnológica de la Huasteca Hidalguense (UTHH)' },
    { key: 9, municipio: 'Atotonilco de Tula', institucion: 'Universidad Tecnológica Tula-Tepejí (UTTT)' },
    { key: 10, municipio: 'Atotonilco el Grande', institucion: 'Universidad Politécnica de Pachuca (UPP)' },
    { key: 11, municipio: 'Calnali', institucion: 'Universidad Tecnológica de la Huasteca Hidalguense (UTHH)' },
    { key: 12, municipio: 'Chapulhuacán', institucion: 'Universidad Tecnológica Tula-Tepejí (UTTT)' },
    { key: 13, municipio: 'Cuautepec de Hinojosa', institucion: 'Universidad Politécnica de Tulancingo (UPT)' },
    { key: 14, municipio: 'El Arenal', institucion: 'Universidad Politécnica de Francisco I Madero (UPFIM)' },
    { key: 15, municipio: 'Emiliano Zapata', institucion: 'Instituto Tecnológico Superior del Oriente del Estado de Hidalgo (ITESA)' },
    { key: 16, municipio: 'Epazoyucan', institucion: 'Universidad Politécnica de Pachuca (UPP)' },
    { key: 17, municipio: 'Francisco I. Madero', institucion: 'Colegio Libre de Hidalgo (CLH)' },
    { key: 18, municipio: 'Huasca de Ocampo', institucion: 'Universidad Politécnica Metropolitana de Hidalgo (UPMH)' },
    { key: 19, municipio: 'Huautla', institucion: 'Universidad Tecnológica de la Huasteca Hidalguense (UTHH)' },
    { key: 20, municipio: 'Huazalingo', institucion: 'Universidad Politécnica de Huejutla (UPH)' },
    { key: 21, municipio: 'Huehuetla', institucion: 'Universidad Intercultural del Estado de Hidalgo (UICEH)' },
    { key: 22, municipio: 'Huejutla de Reyes', institucion: 'Universidad Politécnica de Huejutla (UPH)' },
    { key: 23, municipio: 'Jaltocán', institucion: 'Universidad Politécnica de Huejutla (UPH)' },
    { key: 24, municipio: 'Juárez Hidalgo', institucion: 'Universidad Politécnica de Francisco I Madero (UPFIM)' },
    { key: 25, municipio: 'Lolotla', institucion: 'Universidad Tecnológica de la Huasteca Hidalguense (UTHH)' },
    { key: 26, municipio: 'Metztitlán', institucion: 'Universidad Politécnica de Francisco I Madero (UPFIM)' },
    { key: 27, municipio: 'Mineral de la Reforma', institucion: 'Universidad Tecnológica de Mineral de la Reforma (UTMIR)' },
    { key: 28, municipio: 'Mineral del Chico', institucion: 'Universidad Politécnica Metropolitana de Hidalgo (UPMH)' },
    { key: 29, municipio: 'Mineral del Monte', institucion: 'Universidad Tecnológica de la Zona Metropolitana del Valle de México (UTVAM)' },
    { key: 30, municipio: 'Nicolás Flores', institucion: 'Universidad Tecnológica Minera de Zimapán (UTMZ)' },
    { key: 31, municipio: 'Omitlán de Juárez', institucion: 'Universidad Politécnica de Pachuca (UPP)' },
    { key: 32, municipio: 'Pachuca de Soto', institucion: 'Instituto Tecnológico de Estudios Superiores de Monterrey (ITESM)' },
    { key: 33, municipio: 'Pacula', institucion: 'Universidad Tecnológica Minera de Zimapán (UTMZ)' },
    { key: 34, municipio: 'Progreso de Obregón', institucion: 'Universidad Politécnica de Francisco I Madero (UPFIM)' },
    { key: 35, municipio: 'San Agustín Tlaxiaca', institucion: 'Instituto Tecnológico Superior del Oriente del Estado de Hidalgo (ITESA)' },
    { key: 36, municipio: 'San Bartolo Tutotepec', institucion: 'Universidad Intercultural del Estado de Hidalgo (UICEH)' },
    { key: 37, municipio: 'San Felipe Orizatlán', institucion: 'Universidad Politécnica de Huejutla (UPH)' },
    { key: 38, municipio: 'San Salvador', institucion: 'Universidad Politécnica de Francisco I Madero (UPFIM)' },
    { key: 39, municipio: 'Santiago de Anaya', institucion: 'Universidad Politécnica de Francisco I Madero (UPFIM)' },
    { key: 40, municipio: 'Santiago Tulantepec de Lugo Guerrero', institucion: 'Universidad Politécnica de Tulancingo (UPT)' },
    { key: 41, municipio: 'Tenango de Doria', institucion: 'Universidad Intercultural del Estado de Hidalgo (UICEH)' },
    { key: 42, municipio: 'Tepeapulco', institucion: 'Instituto Tecnológico Superior del Oriente del Estado de Hidalgo (ITESA)' },
    { key: 43, municipio: 'Tepehuacán de Guerrero', institucion: 'Universidad Tecnológica de la Huasteca Hidalguense (UTHH)' },
    { key: 44, municipio: 'Tepeji del Río de Ocampo', institucion: 'Universidad Tecnológica Tula-Tepejí (UTTT)' },
    { key: 45, municipio: 'Tepetitlán', institucion: 'Universidad Tecnológica Tula-Tepejí (UTTT)' },
    { key: 46, municipio: 'Tetepango', institucion: 'Universidad Tecnológica Tula-Tepejí (UTTT)' },
    { key: 47, municipio: 'Tizayuca', institucion: 'Universidad Tecnológica de la Zona Metropolitana del Valle de México (UTVAM)' },
    { key: 48, municipio: 'Tlahuiltepa', institucion: 'Universidad Tecnológica de Mineral de la Reforma (UTMIR)' },
    { key: 49, municipio: 'Tlanalapa', institucion: 'Instituto Tecnológico Superior del Oriente del Estado de Hidalgo (ITESA)' },
    { key: 50, municipio: 'Tlanchinol', institucion: 'Universidad Tecnológica de la Huasteca Hidalguense (UTHH)' },
  ];
  

  return (
    <div className="otra-informacion-container">
      <h2>Otra Información</h2>
      <div className="home-container">
        <div className="card" onClick={() => openModal('universidades')}>
          <img src="img/universidades.jpg" alt="Universidades participantes" />
          <div className="card-content">
            <h3>Universidades participantes</h3>
            <p>Ver las universidades participantes.</p>
            <button>Ver más</button>
          </div>
        </div>
        <div className="card" onClick={() => openModal('clasificacion')}>
          <img src="img/clasificacion.png" alt="Clasificación de los indicadores" />
          <div className="card-content">
            <h3>Clasificación de los indicadores</h3>
            <p>Ver la clasificación de los indicadores.</p>
            <button>Ver más</button>
          </div>
        </div>
        <div className="card" onClick={() => openModal('guia')}>
          <img src="img/guia.png" alt="Guía consultiva de desempeño municipal" />
          <div className="card-content">
            <h3>Guía consultiva de desempeño municipal</h3>
            <p>Ver la guía consultiva de desempeño municipal.</p>
            <button>Ver más</button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen === 'universidades'} onRequestClose={closeModal} contentLabel="Universidades participantes">
        <h2>Universidades participantes</h2>
        <button onClick={closeModal}>Cerrar</button>
        <Table columns={universidadesColumns} dataSource={universidadesData} pagination={false} />
      </Modal>

      <Modal isOpen={modalIsOpen === 'clasificacion'} onRequestClose={closeModal} contentLabel="Clasificación de los indicadores">
        <h2>Clasificación de los indicadores</h2>
        <button onClick={closeModal}>Cerrar</button>
        <embed src="doc/clasificacion.pdf" type="application/pdf" width="100%" height="600px" />
      </Modal>

      <Modal isOpen={modalIsOpen === 'guia'} onRequestClose={closeModal} contentLabel="Guía consultiva de desempeño municipal">
        <h2>Guía consultiva de desempeño municipal</h2>
        <button onClick={closeModal}>Cerrar</button>
        <embed src="doc/gdm.pdf" type="application/pdf" width="100%" height="600px" />
      </Modal>

      <div className="bottom-left">
        <button onClick={() => navigate('/')}>Volver</button>
      </div>
    </div>
  );
};

export default OtraInformacion;
