import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './Mapa.css';
import EstadoIndicador from './EstadoIndicador';
import Modal from 'react-modal';
import Legend from './Legend';
import debounce from 'lodash/debounce';
import { Spin } from 'antd';


Modal.setAppElement('#root');

// Corregir el problema del icono por defecto en Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// Función para determinar el color según el valor del indicador
const getColor = (value) => {
  if (value === null || value === undefined) {
    return 'rgba(102, 45, 45, 0.95)'; // Cherry para valores no definidos
  }
  switch (value) {
    case 1:
      return 'rgba(144, 232, 82, 0.8)';  // Verde con 80% de opacidad
    case 2:
      return 'rgba(241, 255, 64, 0.8)';  // Amarillo con 80% de opacidad
    case 3:
      return 'rgba(255, 0, 0, 0.8)';     // Rojo con 80% de opacidad
    case 4:
      return 'rgba(255, 255, 255, 0.8)'; // Blanco con 80% de opacidad
    case 5:
      return 'rgba(176, 176, 176, 0.8)'; // Gris con 80% de opacidad
    case 6:
      return 'rgba(102, 45, 45, 0.95)'; // Cherry con 80% de opacidad
    default:
      return 'rgba(0, 0, 0, 0.8)';       // Negro con 80% de opacidad para valores desconocidos
  }
};
const uniqueSortedMunicipios = (data) => {
  const municipiosSet = new Set(data.map(item => item.NOMGEO));
  return Array.from(municipiosSet).sort((a, b) => a.localeCompare(b));
};

// Componente para manejar el zoom al municipio seleccionado
const ZoomToFeature = ({ feature, bringToFront }) => {
  const map = useMap();

  useEffect(() => {
    if (feature) {
      const coordinates = feature.geom.coordinates[0][0].map(coord => [coord[1], coord[0]]);
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds);

      if (bringToFront) {
        L.polygon(coordinates).bringToFront();
      }
    }
  }, [feature, map, bringToFront]);

  return null;
};

// Componente para capturar el nivel de zoom del mapa
const CaptureZoomLevel = ({ setZoomLevel }) => {
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    },
  });

  return null;
};

// Mapa de indicadores a nombres y tipos
const indicatorMap = {
  M1_1_1: { nombre: 'Bando de Policía y Gobierno', tipo: 'Gestión' },
  M1_1_2: { nombre: 'Manuales de Organización', tipo: 'Gestión' },
  M1_1_3: { nombre: 'Tabulador de sueldos con la estructura salarial del personal', tipo: 'Gestión' },
  M1_1_4: { nombre: 'Unidades administrativas existentes', tipo: 'Desempeño' },
  M1_1_5: { nombre: 'Personal municipal total por cada 1,000 habitantes', tipo: 'Desempeño' },
  M1_1_6: { nombre: 'Nivel salarial del Presidente (a) Municipal', tipo: 'Desempeño' },
  M1_1_7: { nombre: 'Participación de las mujeres en puestos de mando medio y superior', tipo: 'Desempeño' },
  // Indicadores de planeación
  M1_2_1: { nombre: 'Lineamientos de planeación municipal', tipo: 'Gestión' },
  M1_2_2: { nombre: 'Comité o cuerpo colegiado de planeación municipal', tipo: 'Gestión' },
  M1_2_3: { nombre: 'Plan Municipal de Desarrollo', tipo: 'Gestión' },
  M1_2_4: { nombre: 'Índice de Planeación Municipal', tipo: 'Desempeño' },
  // Indicadores de contraloría
  M1_3_1: { nombre: 'Programa anual de auditoría interna', tipo: 'Gestión' },
  M1_3_2: { nombre: 'Lineamientos para la entrega - recepción de la administración pública municipal', tipo: 'Gestión' },
  M1_3_3: { nombre: 'Tasa de observaciones documentadas en las auditorías internas', tipo: 'Desempeño' },
  // Indicadores de capacitación
  M1_4_1: { nombre: 'Programas de capacitación', tipo: 'Capacitación' },
  M1_4_2: { nombre: 'Cursos impartidos', tipo: 'Capacitación' },
  M1_4_3: { nombre: 'Participantes en los cursos', tipo: 'Capacitación' },
  // Indicadores de ingresos
  M2_1_1: { nombre: 'Ley de ingresos municipal del año en curso', tipo: 'Gestión' },
  M2_1_2: { nombre: 'Reglamento municipal de catastro', tipo: 'Gestión' },
  M2_1_3: { nombre: 'Sistema de información catastral', tipo: 'Gestión' },
  M2_1_4: { nombre: 'Capacidad financiera', tipo: 'Desempeño' },
  M2_1_5: { nombre: 'Tasa de crecimiento real anual de la recaudación del impuesto predial', tipo: 'Desempeño' },
  M2_1_6: { nombre: 'Tasa de crecimiento real anual de la recaudación por derecho de agua', tipo: 'Desempeño' },
  M2_1_7: { nombre: 'Tasa de crecimiento real anual de la recaudación de otros ingresos propios', tipo: 'Desempeño' },
  // Indicadores de egresos
  M2_2_1: { nombre: 'Presupuesto de egresos municipal', tipo: 'Gestión' },
  M2_2_2: { nombre: 'Armonización Contable', tipo: 'Gestión' },
  M2_2_3: { nombre: 'Cuenta Pública', tipo: 'Gestión' },
  M2_2_4: { nombre: 'Costo de operación', tipo: 'Desempeño' },
  M2_2_5: { nombre: 'Capacidad de Inversión', tipo: 'Desempeño' },
  // Indicadores de disciplina financiera
  M2_3_1: { nombre: 'Programa para minimizar el peso de la deuda pública en los ingresos municipales', tipo: 'Gestión' },
  M2_3_2: { nombre: 'Proporción de Adeudos de Ejercicios Fiscales Anteriores (ADEFAS)', tipo: 'Desempeño' },
  M2_3_3: { nombre: 'Balance presupuestario sostenible', tipo: 'Desempeño' },
  M2_3_4: { nombre: 'Nivel de endeudamiento municipal', tipo: 'Desempeño' },
  // Indicadores de patrimonio
  M2_4_1: { nombre: 'Disposición normativa en materia de patrimonio municipal', tipo: 'Gestión' },
  M2_4_2: { nombre: 'Inventario de Bienes muebles e inmuebles.', tipo: 'Gestión' },
  M2_4_3: { nombre: 'Administración de bienes muebles e inmuebles patrimonio del municipio. ', tipo: 'Desempeño' },
  // Indicadores de desarrollo_urbano
  M3_1_1: { nombre: 'Plan o Programa de Desarrollo Urbano Municipal (PDU)', tipo: 'Gestión' },
  M3_1_2: { nombre: 'Emisión de licencias de construcción', tipo: 'Gestión' },
  M3_1_3: { nombre: 'Unidad responsable de la planeación urbana', tipo: 'Gestión' },
  M3_1_4: { nombre: 'Índice de Planeación Urbana', tipo: 'Desempeño' },
  // Indicadores de ordenamiento_ecologico
  M3_2_1: { nombre: 'Reglamento o lineamientos municipales del ordenamiento ecológico local, con las atribuciones', tipo: 'Gestión' },
  M3_2_2: { nombre: 'Programa de Ordenamiento Ecológico Local', tipo: 'Gestión' },
  M3_2_3: { nombre: 'Acciones para la implementación del Ordenamiento Ecológico', tipo: 'Gestión' },
  M3_2_4: { nombre: 'Índice de ordenamiento ecológico', tipo: 'Desempeño' },
  // Indicadores de proteccion_civil
  M3_3_1: { nombre: 'Reglamento de Protección Civil', tipo: 'Gestión' },
  M3_3_2: { nombre: 'Unidad de protección civil', tipo: 'Gestión' },
  M3_3_3: { nombre: 'Consejo Municipal de Protección Civil', tipo: 'Gestión' },
  M3_3_4: { nombre: 'Atlas municipal de riesgos', tipo: 'Gestión' },
  M3_3_5: { nombre: 'Programa Municipal de Protección Civil', tipo: 'Gestión' },
  M3_3_6: { nombre: 'Tasa de crecimiento de asentamientos humanos en zonas de riesgo', tipo: 'Desempeño' },
  // Indicadores de coordinacion_urbana
  M3_4_1: { nombre: 'Diagnóstico de la zona metropolitana', tipo: 'Gestión' },
  M3_4_2: { nombre: 'Gobernanza metropolitana', tipo: 'Gestión' },
  M3_4_3: { nombre: 'Programa de la zona metropolitana', tipo: 'Gestión' },
  // Indicadores de marco_normativo
  M4_1_1: { nombre: 'Reglamentación municipal para la prestación de los servicios públicos', tipo: 'Gestión' },
  M4_1_2: { nombre: 'Estructura administrativa para la prestación de los servicios públicos', tipo: 'Gestión' },
  // Indicadores de diagnostico
  M4_2_1: { nombre: 'Situación del agua potable, drenaje, alcantarillado, tratamiento y disposición de sus aguas residuale', tipo: 'Gestión' },
  M4_2_2: { nombre: 'Situación del Alumbrado público', tipo: 'Gestión' },
  M4_2_3: { nombre: 'Situación de limpia, recolección, traslado, tratamiento y disposición final de residuos', tipo: 'Gestión' },
  M4_2_4: { nombre: 'Situación de Mercados (centrales de abasto) y panteones', tipo: 'Gestión' },
  // Indicadores de acciones
  M4_3_1: { nombre: 'Programa operativo anual para la prestación de los servicios público', tipo: 'Gestión' },
  M4_3_2: { nombre: 'Cartera de proyectos para mejorar la prestación de los servicios públicos', tipo: 'Gestión' },
  // Indicadores de evaluacion
  M4_4_1: { nombre: 'Tasa de abatimiento de calles sin revestimiento', tipo: 'Desempeño' },
  M4_4_2: { nombre: 'Tasa de abatimiento de la carencia de servicio de agua entubada en las viviendas', tipo: 'Desempeño' },
  M4_4_3: { nombre: 'Tasa de abatimiento del déficit del servicio de drenaje en viviendas particulares', tipo: 'Desempeño' },
  M4_4_4: { nombre: 'Tasa de abatimiento del déficit del servicio de alcantarillado en arterias viales ', tipo: 'Desempeño' },
  M4_4_5: { nombre: 'Porcentaje de agua tratada', tipo: 'Desempeño' },
  M4_4_6: { nombre: 'Cobertura del servicio de recolección de residuos sólidos', tipo: 'Desempeño' },
  M4_4_7: { nombre: 'Tasa de crecimiento anual del índice de áreas verdes y recreativas per cápita', tipo: 'Desempeño' },
  M4_4_8: { nombre: 'Cobertura en el servicio de alumbrado público', tipo: 'Desempeño' },
  M4_4_9: { nombre: 'Cobertura en el servicio de mercados públicos per cápita', tipo: 'Desempeño' },
  M4_4_10: { nombre: 'Cobertura en el servicio de panteones', tipo: 'Desempeño' },
  // Indicadores de preservacion
  M5_1_1: { nombre: 'Reglamento para el cuidado del medio ambiente', tipo: 'Gestión' },
  M5_1_2: { nombre: 'Plan o programa Municipal de Protección al Ambiente', tipo: 'Gestión' },
  // Indicadores de cambio_climatico
  M5_2_1: { nombre: 'Atribuciones normativas en materia de cambio climático', tipo: 'Gestión' },
  M5_2_2: { nombre: 'Programa o documento de adaptación y mitigación al cambio climático', tipo: 'Gestión' },
  M5_2_3: { nombre: 'Acciones del municipio para disminuir la vulnerabilidad ante el cambio climático', tipo: 'Gestión' },
  M5_2_4: { nombre: 'Edificaciones', tipo: 'Gestión' },
  // Indicadores de servicios_publicos_sustentables
  M5_3_1: { nombre: 'Eficiencia en servicio de agua potable', tipo: 'Gestión' },
  M5_3_2: { nombre: 'Eficiencia en Alumbrado público', tipo: 'Gestión' },
  M5_3_3: { nombre: 'Mejora en el uso de la flota vehicular del municipio', tipo: 'Gestión' },
  M5_3_4: { nombre: 'Abatimiento del costo promedio por luminaria', tipo: 'Desempeño' },
  // Indicadores de educacion
  M6_1_1: { nombre: 'Diagnóstico de educación básica', tipo: 'Gestión' },
  M6_1_2: { nombre: 'Acciones anuales de apoyo a la educación básica', tipo: 'Gestión' },
  M6_1_3: { nombre: 'Coordinación para promover la educación básica en el municipio', tipo: 'Gestión' },
  // Indicadores de salud
  M6_2_1: { nombre: 'Diagnóstico en materia de salud', tipo: 'Gestión' },
  M6_2_2: { nombre: 'Acciones anuales de fomento y cuidado de la salud', tipo: 'Gestión' },
  M6_2_3: { nombre: 'Coordinación en materia de salud', tipo: 'Gestión' },
  // Indicadores de grupos_vulnerables
  M6_3_1: { nombre: 'Diagnóstico de grupos vulnerables', tipo: 'Gestión' },
  M6_3_2: { nombre: 'Acciones anuales para la atención de grupos vulnerables', tipo: 'Gestión' },
  // Indicadores de igualdad_de_genero
  M6_4_1: { nombre: 'Instancia municipal responsable de promover la igualdad de género', tipo: 'Gestión' },
  M6_4_2: { nombre: 'Diagnóstico de igualdad de género', tipo: 'Gestión' },
  M6_4_3: { nombre: 'Acciones anuales para la promoción de la igualdad de género', tipo: 'Gestión' },
  M6_4_4: { nombre: 'Coordinación para la atención de igualdad de género', tipo: 'Gestión' },
  // Indicadores de juventud
  M6_5_1: { nombre: 'Diagnóstico de juventud', tipo: 'Gestión' },
  M6_5_2: { nombre: 'Acciones anuales orientadas a la juventud', tipo: 'Gestión' },
  // Indicadores de deporte_y_recreación
  M6_5_1: { nombre: 'Diagnóstico de deporte y recreación', tipo: 'Gestión' },
  M6_5_2: { nombre: 'Acciones anuales para promover el deporte y la recreación', tipo: 'Gestión' },
  // Indicadores de mejora_regulatoria
  M7_1_1: { nombre: 'Reglamento publicado del Consejo Municipal de Mejora Regulatoria', tipo: 'Gestión' },
  M7_1_2: { nombre: 'Consejo Municipal de Mejora Regulatoria', tipo: 'Gestión' },
  M7_1_3: { nombre: 'Apertura de una unidad económica de bajo riesgo', tipo: 'Gestión' },
  M7_1_4: { nombre: 'Atracción y retención de inversión de todas las actividades económicas existentes', tipo: 'Desempeño' },
  // Indicadores de vocacion_productiva
  M7_2_1: { nombre: 'Diagnóstico del sector', tipo: 'Gestión' },
  M7_2_2: { nombre: 'Programa de fomento del sector', tipo: 'Gestión' },
  M7_2_3: { nombre: 'Atracción y retención de inversión en el sector', tipo: 'Desempeño' },
  // Indicadores de fomento_economico
  M7_3_1: { nombre: 'Reglamento de desarrollo económico', tipo: 'Gestión' },
  M7_3_2: { nombre: 'Programa municipal de fomento económico', tipo: 'Gestión' },
  M7_3_3: { nombre: 'Vinculación para el fomento económico', tipo: 'Gestión' },
  // Indicadores de transparencia
  M8_1_1: { nombre: 'Reglamento municipal de transparencia y acceso a la información pública', tipo: 'Gestión' },
  M8_1_2: { nombre: 'Programa de transparencia y acceso a la información pública', tipo: 'Gestión' },
  M8_1_3: { nombre: 'Eficacia en la atención de solicitudes de acceso a la información', tipo: 'Desempeño' },
  M8_1_4: { nombre: 'Cumplimiento de obligaciones de transparencia', tipo: 'Desempeño' },
  // Indicadores de participacion_ciudadana
  M8_2_1: { nombre: 'Mecanismo para atender las propuestas ciudadanas', tipo: 'Gestión' },
  M8_2_2: { nombre: 'Seguimiento y atención de las propuestas ciudadanas', tipo: 'Gestión' },
  // Indicadores de etica_publica
  M8_3_1: { nombre: 'Código de ética de los servidores públicos municipales', tipo: 'Gestión' },
  M8_3_2: { nombre: 'Difusión y capacitación sobre el Código de ética', tipo: 'Gestión' },
  M8_3_3: { nombre: 'Vinculación para el fomento económico', tipo: 'Gestión' },


//------agregar tema aqui---//
};

const Mapa = () => {
  const [data, setData] = useState([]);
  const [planeacionData, setPlaneacionData] = useState([]);
  const [contraloriaData, setContraloriaData] = useState([]);
  const [capacitacionData, setCapacitacionData] = useState([]);
  const [hoveredMunicipio, setHoveredMunicipio] = useState('');
  const [ingresosData, setIngresosData] = useState([]);
  const [egresosData, setEgresosData] = useState([]);
  const [disciplinaFinancieraData, setDisciplinaFinancieraData] = useState([]);
  const [patrimonioData, setPatrimonioData] = useState([]);
  const [desarrolloUrbanoData, setDesarrolloUrbanoData] = useState([]);
  const [ordenamientoEcologicoData, setOrdenamientoEcologicoData] = useState([]);
  const [proteccionCivilData, setProteccionCivilData] = useState([]);
  const [coordinacionUrbanaData, setCoordinacionUrbanaData] = useState([]);
  const [marcoNormativoData, setMarcoNormativoData] = useState([]);
  const [diagnosticoData, setDiagnosticoData] = useState([]);
  const [accionesData, setAccionesData] = useState([]);
  const [EvaluacionData, setEvaluacionData] = useState([]);
  const [preservacionData, setPreservacionData] = useState([]);
  const [cambioClimaticoData, setCambioClimaticoData] = useState([]);
  const [serviciosData, setServiciosData] = useState([]);
  const [educacionData, setEducacionData] = useState([]);
  const [saludData, setSaludData] = useState([]);
  const [gruposData, setGruposData] = useState([]);
  const [igualdadData, setIgualdadData] = useState([]);
  const [juventudData, setJuventudData] = useState([]);
  const [deporteData, setDeporteData] = useState([]);
  const [mejoraData, setMejoraData] = useState([]);
  const [vocacionData, setVocacionData] = useState([]);
  const [fomentoData, setFomentoData] = useState([]);
  const [transparenciaData, setTransparenciaData] = useState([]);
  const [participacionData, setParticipacionData] = useState([]);
  const [eticaData, setEticaData] = useState([]);
  //------agregar tema aqui---//
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [selectedModule, setSelectedModule] = useState('M1');
  const [selectedTheme, setSelectedTheme] = useState('M1_1');
  const [selectedIndicator, setSelectedIndicator] = useState('M1_1_1');
  const [selectedYear, setSelectedYear] = useState('23');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [bringToFront, setBringToFront] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [indicatorName, setIndicatorName] = useState('');
  const [indicatorType, setIndicatorType] = useState('');
  const [zoomLevel, setZoomLevel] = useState(8);
                                                                     
  const themeMap = {
    'M1_1': 'Estructura',
    'M1_2': 'Planeación',
    'M1_3': 'Contraloría',
    'M1_4': 'Capacitación',
    'M2_1': 'Ingresos',
    'M2_2': 'Egresos',
    'M2_3': 'Disciplina Financiera',
    'M2_4': 'Patrimonio',
    'M3_1': 'Desarrollo Urbano',
    'M3_2': 'Ordenamiento Ecológico',
    'M3_3': 'Protección Civil',
    'M3_4': 'Coordinación urbana',
    'M4_1': 'Marco Normativo',
    'M4_2': 'Diagnóstico',
    'M4_3': 'Acciones',
    'M4_4': 'Evaluacion',
    'M5_1': 'Preservación del medio ambiente',
    'M5_2': 'Cambio climático',
    'M5_3': 'Servicios públicos sustentables',
    'M6_1': 'Educación',
    'M6_2': 'Salud',
    'M6_3': 'Grupos vulnerables',
    'M6_4': 'Igualdad de género',
    'M6_5': 'Juventud',
    'M6_6': 'Deporte y recreación',
    'M7_1': 'Mejora regulatoria',
    'M7_2': 'Vocación productiva',
    'M7_3': 'Fomento económico',
    'M8_1': 'Transparencia',
    'M8_2': 'Participación ciudadana',
    'M8_3': 'Ética pública',

     //------agregar tema aqui---//
  };
 

                                                                     
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
        try {
            const [
                estructuraResponse,
                planeacionResponse,
                contraloriaResponse,
                capacitacionResponse,
                ingresosResponse,
                egresosResponse,
                disciplinaFinancieraResponse,
                patrimonioResponse,
                desarrolloUrbanoResponse,
                ordenamientoEcologicoResponse,
                proteccionCivilResponse,
                coordinacionUrbanaResponse,
                marcoNormativoResponse,
                diagnosticoResponse,
                accionesResponse,
                evaluacionResponse,
                preservacionResponse,
                cambioClimaticoResponse,
                serviciosResponse,
                educacionResponse,
                saludResponse,
                gruposResponse,
                igualdadResponse,
                juventudResponse,
                deporteResponse,
                mejoraResponse,
                vocacionResponse,
                fomentoResponse,
                transparenciaResponse,
                participacionResponse,
                eticaResponse
                 //------agregar tema aqui---//
            ] = await Promise.all([
                axios.get('http://localhost:5000/indicadores_M1_estructura'),
                axios.get('http://localhost:5000/indicadores_M1_planeacion'),
                axios.get('http://localhost:5000/indicadores_M1_contraloria'),
                axios.get('http://localhost:5000/indicadores_M1_capacitacion'),
                axios.get('http://localhost:5000/indicadores_M2_ingresos'),
                axios.get('http://localhost:5000/indicadores_M2_egresos'),
                axios.get('http://localhost:5000/indicadores_M2_disciplina_financiera'),
                axios.get('http://localhost:5000/indicadores_M2_patrimonio'), // Change . to ,
                axios.get('http://localhost:5000/indicadores_M3_desarrollo_urbano'),
                axios.get('http://localhost:5000/indicadores_M3_ordenamiento_ecologico'),
                axios.get('http://localhost:5000/indicadores_M3_proteccion_civil'),
                axios.get('http://localhost:5000/indicadores_M3_coordinacion_urbana'),
                axios.get('http://localhost:5000/indicadores_M4_marco_normativo'),
                axios.get('http://localhost:5000/indicadores_M4_diagnostico'),
                axios.get('http://localhost:5000/indicadores_M4_acciones'),
                axios.get('http://localhost:5000/indicadores_M4_evaluacion'),
                axios.get('http://localhost:5000/indicadores_M5_preservacion'),
                axios.get('http://localhost:5000/indicadores_M5_cambio_climatico'),
                axios.get('http://localhost:5000/indicadores_M5_servicios'),
                axios.get('http://localhost:5000/indicadores_M6_educacion'),
                axios.get('http://localhost:5000/indicadores_M6_salud'),
                axios.get('http://localhost:5000/indicadores_M6_grupos'),
                axios.get('http://localhost:5000/indicadores_M6_igualdad'),
                axios.get('http://localhost:5000/indicadores_M6_juventud'),
                axios.get('http://localhost:5000/indicadores_M6_deporte'),
                axios.get('http://localhost:5000/indicadores_M7_mejora'),
                axios.get('http://localhost:5000/indicadores_M7_vocacion'),
                axios.get('http://localhost:5000/indicadores_M7_fomento'),
                axios.get('http://localhost:5000/indicadores_M8_transparencia'),
                axios.get('http://localhost:5000/indicadores_M8_participacion'),
                axios.get('http://localhost:5000/indicadores_M8_etica')
                 //------agregar tema aqui---//
            ]);

            setData(estructuraResponse.data);
            setPlaneacionData(planeacionResponse.data);
            setContraloriaData(contraloriaResponse.data);
            setCapacitacionData(capacitacionResponse.data);
            setIngresosData(ingresosResponse.data);
            setEgresosData(egresosResponse.data);
            setDisciplinaFinancieraData(disciplinaFinancieraResponse.data);
            setPatrimonioData(patrimonioResponse.data);
            setDesarrolloUrbanoData(desarrolloUrbanoResponse.data);
            setOrdenamientoEcologicoData(ordenamientoEcologicoResponse.data);
            setProteccionCivilData(proteccionCivilResponse.data);
            setCoordinacionUrbanaData(coordinacionUrbanaResponse.data);
            setMarcoNormativoData(marcoNormativoResponse.data);  
            setDiagnosticoData(diagnosticoResponse.data); 
            setAccionesData(accionesResponse.data);
            setEvaluacionData(evaluacionResponse.data); 
            setPreservacionData(preservacionResponse.data); 
            setCambioClimaticoData(cambioClimaticoResponse.data);
            setServiciosData(serviciosResponse.data);   
            setEducacionData(educacionResponse.data); 
            setSaludData(saludResponse.data); 
            setGruposData(gruposResponse.data); 
            setIgualdadData(igualdadResponse.data); 
            setJuventudData(juventudResponse.data); 
            setDeporteData(deporteResponse.data); 
            setMejoraData(mejoraResponse.data);
            setVocacionData(vocacionResponse.data); 
            setFomentoData(fomentoResponse.data); 
            setTransparenciaData(transparenciaResponse.data); 
            setParticipacionData(participacionResponse.data); 
            setEticaData(eticaResponse.data);  
            //------agregar tema aqui---//
            setLoading(false); 
        } catch (error) {
            console.error('Error al obtener datos del backend:', error);
            setLoading(false);  // Finaliza la carga si hay un error
        }
    };

    fetchData();
}, []);

  

  useEffect(() => {
    const indicatorKey = selectedIndicator;
    const { nombre } = indicatorMap[indicatorKey] || { nombre: 'Desconocido' };
    setIndicatorName(nombre);
  }, [selectedIndicator]);

  const handleModuleChange = useCallback((event) => {
    const module = event.target.value;
    setSelectedModule(module);
    setSelectedTheme(`${module}_1`);
    setSelectedIndicator(`${module}_1_1`);
  }, []);

  const handleThemeChange = useCallback((event) => {
    const theme = event.target.value;
    setSelectedTheme(theme);
    setSelectedIndicator(`${theme}_1`);
  }, []);
  

  const handleIndicatorChange = useCallback((event) => {
    setSelectedIndicator(event.target.value);
  }, []);

  const handleYearChange = useCallback((event) => {
    setSelectedYear(event.target.value);
  }, []);

  const debouncedSearchChange = useCallback(debounce((value) => {
    setSearchTerm(value);
  }, 300), []);

  const handleSearchChange = useCallback((event) => {
    const selectedMunicipio = event.target.value;
    setSearchTerm(selectedMunicipio);
 //------agregar tema aqui---//
    const feature = [
      ...data,
      ...planeacionData,
      ...contraloriaData,
      ...capacitacionData,
      ...ingresosData,
      ...egresosData,
      ...disciplinaFinancieraData,
      ...patrimonioData,
      ...desarrolloUrbanoData,
      ...ordenamientoEcologicoData,
      ...proteccionCivilData,
      ...coordinacionUrbanaData,
      ...marcoNormativoData,
      ...diagnosticoData,
      ...accionesData,
      ...EvaluacionData,
      ...preservacionData,
      ...cambioClimaticoData,
      ...serviciosData,
      ...educacionData,
      ...saludData,
      ...gruposData,
      ...igualdadData,
      ...juventudData,
      ...deporteData,
      ...mejoraData,
      ...vocacionData,
      ...fomentoData,
      ...transparenciaData,
      ...participacionData,
      ...eticaData
          //------agregar tema aqui---//
    ].find(item => item.NOMGEO === selectedMunicipio);
  
    if (feature) {
      setSelectedFeature(feature);
      setBringToFront(true);
      const indicatorKey = selectedIndicator;
      const { nombre, tipo } = indicatorMap[indicatorKey] || { nombre: 'Desconocido', tipo: 'Desconocido' };
      setIndicatorName(nombre);
      setIndicatorType(tipo);
      // No abrir el gráfico
      // const cleanedChartData = [
      //   feature[`${indicatorKey}_20`],
      //   feature[`${indicatorKey}_21`],
      //   feature[`${indicatorKey}_22`],
      //   feature[`${indicatorKey}_23`]
      // ].map(value => (value === undefined || value === null ? 0 : value));
      // setChartData(cleanedChartData);
      // setModalIsOpen(true);
    }
  }, [
    data,
    planeacionData,
    contraloriaData,
    capacitacionData,
    ingresosData,
    egresosData,
    disciplinaFinancieraData,
    patrimonioData, 
    desarrolloUrbanoData,
    ordenamientoEcologicoData,
    proteccionCivilData,
    coordinacionUrbanaData,
    marcoNormativoData,
    diagnosticoData,
    accionesData,
    EvaluacionData,
    preservacionData,
    cambioClimaticoData,
    serviciosData, 
    educacionData,
    saludData,
    gruposData,
    igualdadData,
    juventudData,
    deporteData,
    mejoraData,
    vocacionData,
    fomentoData,
    transparenciaData,
    participacionData,
    eticaData,
    //------agregar tema aqui---// 
    selectedIndicator
  ]);
  
  
  
  

  const handleMouseOver = useCallback((e, item, index, polygonIndex) => {
    const indicatorKey = `${selectedIndicator}_${selectedYear}`;
    const value = item[indicatorKey];
    if (value !== undefined && value !== null) {
      setHoveredMunicipio(item.NOMGEO);
      setHoveredValue(value);
      setHoveredPolygon(`${index}-${polygonIndex}`);
      e.target.setStyle({
        color: 'white',
        weight: 3,
      });
      e.target.bringToFront();
    }
  }, [selectedIndicator, selectedYear]);
  

  const handleMouseOut = useCallback((e) => {
    setHoveredMunicipio('');
    setHoveredValue(null);
    setHoveredPolygon(null);
    e.target.setStyle({
      color: 'black',
      weight: 1,
    });
    if (selectedFeature) {
      const coordinates = selectedFeature.geom.coordinates[0][0].map(coord => [coord[1], coord[0]]);
      L.polygon(coordinates).bringToFront();
    }
  }, [selectedFeature]);

  const handlePolygonClick = useCallback((item) => {
    const indicatorKey = selectedIndicator;
    const { nombre, tipo } = indicatorMap[indicatorKey] || { nombre: 'Desconocido', tipo: 'Desconocido' };
    setIndicatorName(nombre);
    setIndicatorType(tipo);
    const cleanedChartData = [
      item[`${indicatorKey}_20`],
      item[`${indicatorKey}_21`],
      item[`${indicatorKey}_22`],
      item[`${indicatorKey}_23`],
      item[`${indicatorKey}_24`]
    ].map(value => (value === undefined || value === null ? 0 : value));
    setChartData(cleanedChartData);
    setSelectedFeature(item);
    setModalIsOpen(true);
  }, [selectedIndicator]);
  


  const getThemesForModule = useCallback((module) => {
    if (module === 'M1') {
      return ['M1_1', 'M1_2', 'M1_3', 'M1_4'];
    } else if (module === 'M2') {
      return ['M2_1', 'M2_2', 'M2_3', 'M2_4'];
    } else if (module === 'M3') {
      return ['M3_1', 'M3_2', 'M3_3', 'M3_4']; 
    } else if (module === 'M4') {
      return ['M4_1', 'M4_2', 'M4_3', 'M4_4']; 
    } else if (module === 'M5') {
      return ['M5_1', 'M5_2', 'M5_3']; 
    } else if (module === 'M6') {
      return ['M6_1', 'M6_2', 'M6_3', 'M6_4', 'M6_5', 'M6_6']; 
    } else if (module === 'M7') {
      return ['M7_1', 'M7_2', 'M7_3']; 
    } else if (module === 'M8') {
      return ['M8_1', 'M8_2', 'M8_3']; 
    }
    //------agregar tema aqui---// 
    return [];
  }, []);
  
  const getIndicatorsForTheme = useCallback((theme) => {
    if (theme.startsWith('M1_')) {
      // Indicadores de Módulo 1
      if (theme === 'M1_1') return ['M1_1_1', 'M1_1_2', 'M1_1_3', 'M1_1_4', 'M1_1_5', 'M1_1_6', 'M1_1_7'];
      if (theme === 'M1_2') return ['M1_2_1', 'M1_2_2', 'M1_2_3', 'M1_2_4'];
      if (theme === 'M1_3') return ['M1_3_1', 'M1_3_2', 'M1_3_3'];
      if (theme === 'M1_4') return ['M1_4_1', 'M1_4_2', 'M1_4_3'];
    } else if (theme.startsWith('M2_')) {
      // Indicadores de Módulo 2
      if (theme === 'M2_1') return ['M2_1_1', 'M2_1_2', 'M2_1_3','M2_1_4','M2_1_5','M2_1_6','M2_1_7'];
      if (theme === 'M2_2') return ['M2_2_1', 'M2_2_2', 'M2_2_3','M2_2_4','M2_2_5'];
      if (theme === 'M2_3') return ['M2_3_1', 'M2_3_2','M2_3_3','M2_3_4'];
      if (theme === 'M2_4') return ['M2_4_1', 'M2_4_2','M2_4_3'];
   } else if (theme.startsWith('M3_')) {
    // Indicadores de Módulo 3
    if (theme === 'M3_1') return ['M3_1_1', 'M3_1_2', 'M3_1_3','M3_1_4'];
    if (theme === 'M3_2') return ['M3_2_1', 'M3_2_2', 'M3_2_3','M3_2_4'];
    if (theme === 'M3_3') return ['M3_3_1', 'M3_3_2','M3_3_3','M3_3_4', 'M3_3_5','M3_3_6'];
    if (theme === 'M3_4') return ['M3_4_1', 'M3_4_2','M3_4_3'];          
    } else if (theme.startsWith('M4_')) {
      // Indicadores de Módulo 4
      if (theme === 'M4_1') return ['M4_1_1', 'M4_1_2'];
      if (theme === 'M4_2') return ['M4_2_1', 'M4_2_2', 'M4_2_3','M4_2_4'];
      if (theme === 'M4_3') return ['M4_3_1', 'M4_3_2'];
      if (theme === 'M4_4') return ['M4_4_1', 'M4_4_2','M4_4_3','M4_4_4', 'M4_4_5','M4_4_6','M4_4_7', 'M4_4_8','M4_4_9','M4_4_10'];
    } else if (theme.startsWith('M5_')) {
      // Indicadores de Módulo 5
      if (theme === 'M5_1') return ['M5_1_1', 'M5_1_2'];
      if (theme === 'M5_2') return ['M5_2_1', 'M5_2_2', 'M5_2_3','M5_2_4'];
      if (theme === 'M5_3') return ['M5_3_1', 'M5_3_2', 'M5_3_3','M5_3_4']; 
    } else if (theme.startsWith('M6_')) {
      // Indicadores de Módulo 6
      if (theme === 'M6_1') return ['M6_1_1', 'M6_1_2', 'M6_1_3'];
      if (theme === 'M6_2') return ['M6_2_1', 'M6_2_2', 'M6_2_3'];
      if (theme === 'M6_3') return ['M6_3_1', 'M6_3_2'];  
      if (theme === 'M6_4') return ['M6_4_1', 'M6_4_2','M6_4_3','M6_4_4'];  
      if (theme === 'M6_5') return ['M6_5_1', 'M6_5_2'];  
      if (theme === 'M6_6') return ['M6_6_1', 'M6_6_2']; 
    } else if (theme.startsWith('M7_')) {
      // Indicadores de Módulo 7
      if (theme === 'M7_1') return ['M7_1_1', 'M7_1_2', 'M7_1_3','M7_1_4'];
      if (theme === 'M7_2') return ['M7_2_1', 'M7_2_2', 'M7_2_3'];
      if (theme === 'M7_3') return ['M7_3_1', 'M7_3_2', 'M7_3_3'];
    } else if (theme.startsWith('M8_')) {
      // Indicadores de Módulo 8
      if (theme === 'M8_1') return ['M8_1_1', 'M8_1_2', 'M8_1_3','M8_1_4'];
      if (theme === 'M8_2') return ['M8_2_1', 'M8_2_2'];
      if (theme === 'M8_3') return ['M8_3_1', 'M8_3_2'];    
      }         
      //------agregar tema aqui---// 
    return []; 
  }, []);
  

  const polygons = useMemo(() => {
    return [
      ...data,
      ...planeacionData,
      ...contraloriaData,
      ...capacitacionData,
      ...ingresosData,
      ...egresosData,
      ...disciplinaFinancieraData,
      ...desarrolloUrbanoData,
      ...ordenamientoEcologicoData,
      ...proteccionCivilData,
      ...marcoNormativoData,
      ...diagnosticoData,
      ...accionesData,
      ...EvaluacionData,
      ...coordinacionUrbanaData,
      ...preservacionData,
      ...cambioClimaticoData,
      ...serviciosData,
      ...educacionData,
      ...saludData,
      ...gruposData,
      ...igualdadData,
      ...juventudData,
      ...deporteData,
      ...mejoraData,
      ...vocacionData,
      ...fomentoData,
      ...transparenciaData,
      ...participacionData,
      ...eticaData,
       //------agregar tema aqui---// 
      ...patrimonioData
    ].map((item, index) => 
      item.geom.coordinates.map((polygon, polygonIndex) => {
        const indicatorKey = `${selectedIndicator}_${selectedYear}`;
        const value = item[indicatorKey];
        if (value !== undefined && value !== null) {
          const color = getColor(value);
          return (
            <Polygon
              key={`${item.id}-${polygonIndex}`}
              positions={polygon[0].map(coord => [coord[1], coord[0]])}
              pathOptions={{
                color: 'black',
                fillColor: color,
                fillOpacity: color === 'rgba(0, 0, 0, 0.0)' ? 0 : 0.8,
                weight: 1,
              }}
              eventHandlers={{
                mouseover: (e) => handleMouseOver(e, item, index, polygonIndex),
                mouseout: handleMouseOut,
                click: () => handlePolygonClick(item)
              }}
            >
              {zoomLevel >= 10 && (
                <Tooltip direction="center" permanent>
                  <span style={{ 
                    fontSize: '11px', 
                    backgroundColor: 'rgba(255, 255, 255, 0)', 
                    padding: '0px 0px', 
                    borderRadius: '4px' 
                  }}>
                    {item.NOMGEO}
                  </span>
                </Tooltip>
              )}
            </Polygon>
          );
        }
        return null;
      })
    );
  }, [
    data,
    planeacionData,
    contraloriaData,
    capacitacionData,
    ingresosData,
    egresosData,
    disciplinaFinancieraData,
    patrimonioData, 
    desarrolloUrbanoData,
    proteccionCivilData,
    coordinacionUrbanaData,
    marcoNormativoData,
    diagnosticoData,
    accionesData,
    EvaluacionData,
    preservacionData,
    cambioClimaticoData,
    serviciosData,
    educacionData,
    saludData,
    gruposData,
    igualdadData,
    juventudData,
    deporteData,
    mejoraData,
    vocacionData,
    fomentoData,
    transparenciaData,
    participacionData,
    eticaData,
    //------agregar tema aqui---//
    selectedIndicator,
    selectedYear,
    zoomLevel,
    handleMouseOver,
    handleMouseOut,
    handlePolygonClick
  ]);
  
  
  //Loading
  const [loading, setLoading] = useState(true);


  return (
    <Spin 
    spinning={loading} 
    tip="Cargando mapa..." 
    size="large"
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
  >
    <div className="map-container">
      <div className="info-box">
        <div className="semaforo" style={{ backgroundColor: getColor(hoveredValue) }}></div>
        <div className="municipio-nombre">
          {hoveredMunicipio}
        </div>
      </div>
      <div className="selector-container">
        <label htmlFor="module-select" className="selector-label">Selecciona un módulo:</label>
        <select id="module-select" value={selectedModule} onChange={handleModuleChange} className="selector-dropdown">
          <option value="M1">Organización</option>
          <option value="M2">Hacienda</option>
          <option value="M3">Gestión del territorio</option>
          <option value="M4">Servicios públicos</option>
          <option value="M5">Medio ambiente</option>
          <option value="M6">Desarrollo social</option>
          <option value="M7">Desarrollo económico</option>
          <option value="M8">Gobierno abierto</option>
        </select>

        <label htmlFor="theme-select" className="selector-label">Selecciona un tema:</label>
        <select id="theme-select" value={selectedTheme} onChange={handleThemeChange} className="selector-dropdown">
          {getThemesForModule(selectedModule).map(theme => (
            <option key={theme} value={theme}>{themeMap[theme]}</option>
          ))}
        </select>


        <label htmlFor="indicator-select" className="selector-label">Selecciona un indicador:</label>
        <select id="indicator-select" value={selectedIndicator} onChange={handleIndicatorChange} className="selector-dropdown">
          {getIndicatorsForTheme(selectedTheme).map(indicator => (
            <option key={indicator} value={indicator}>{indicatorMap[indicator] ? indicatorMap[indicator].nombre : indicator.replace(/_/g, '.')}</option>
          ))}
        </select>

        <label htmlFor="year-select" className="selector-label">Selecciona un año:</label>
        <select id="year-select" value={selectedYear} onChange={handleYearChange} className="selector-dropdown">
          <option value="20">2020</option>
          <option value="21">2021</option>
          <option value="22">2022</option>
          <option value="23">2023</option>
          <option value="24">2024</option>
        </select>
      </div>
      <div className="search-container">
        <label htmlFor="municipio-search" className="search-label">Buscar municipio:</label>
        <input
          id="municipio-search"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          list="municipio-options"
        />
        <datalist id="municipio-options">
          {uniqueSortedMunicipios([
            ...data,
            ...planeacionData,
            ...contraloriaData,
            ...capacitacionData,
            ...ingresosData,
            ...egresosData,
            ...disciplinaFinancieraData,
            ...patrimonioData,
            ...desarrolloUrbanoData,
            ...ordenamientoEcologicoData,
            ...proteccionCivilData,
            ...coordinacionUrbanaData,
            ...marcoNormativoData,
            ...diagnosticoData,
            ...accionesData,
            ...EvaluacionData,
            ...preservacionData,
            ...cambioClimaticoData,
            ...serviciosData,
            ...educacionData,
            ...saludData,
            ...gruposData,
            ...igualdadData,
            ...juventudData,
            ...deporteData,
            ...mejoraData,
            ...vocacionData,
            ...fomentoData,
            ...transparenciaData,
            ...participacionData,
            ...eticaData
            //------agregar tema aqui---// 
          ]).map((municipio, index) => (
            <option key={`${municipio}-${index}`} value={municipio} />
          ))}
        </datalist>


      </div>

      <MapContainer center={[20.51697, -98.73329]} zoom={9} style={{ height: "100vh", width: "100%" }} zoomControl={false} minZoom={8} maxZoom={15}>
        <CaptureZoomLevel setZoomLevel={setZoomLevel} />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        />
        {polygons}
        {selectedFeature && <ZoomToFeature feature={selectedFeature} bringToFront={bringToFront} />}
      </MapContainer>
      <div className="indicator-info-box">
        <h4><strong>Indicador:</strong> {indicatorName}</h4>
        <h4><strong>Año:</strong> 20{selectedYear}</h4>
      </div>
      <Legend />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Estado del Indicador"
        className="modal"
        overlayClassName="overlay"
      >
        <EstadoIndicador 
          datos={chartData} 
          municipio={selectedFeature ? selectedFeature.NOMGEO : ''} 
          nombreIndicador={indicatorName} 
          tipoIndicador={indicatorType} 
        />

        <button onClick={() => setModalIsOpen(false)} className="close-button">Cerrar</button>
      </Modal>
      <div className="bottom-left">
        <a href="/" className="back-button">Volver</a>
      </div>
      </div>
    
  </Spin>
    
  );
};

export default Mapa;
