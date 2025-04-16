require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const wkx = require('wkx');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para todas las rutas
app.use(cors());

// Configura la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ENDPOINTS DE CAPAS GEOGRÁFICAS

// Endpoint para obtener datos de la tabla estructura
app.get('/indicadores_M1_estructura', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM estructura');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para obtener datos de la tabla planeacion
app.get('/indicadores_M1_planeacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM planeacion');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para obtener datos de la tabla contraloria
app.get('/indicadores_M1_contraloria', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contraloria');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para obtener datos de la tabla capacitacion
app.get('/indicadores_M1_capacitacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM capacitacion');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla ingresos M2
app.get('/indicadores_M2_ingresos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingresos');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla egresos M2
app.get('/indicadores_M2_egresos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM egresos');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla disciplina financiera M2
app.get('/indicadores_M2_disciplina_financiera', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM disciplina_financiera');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla patrimonio M2
app.get('/indicadores_M2_patrimonio', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patrimonio');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para obtener datos de la tabla desarrollo_urbano
app.get('/indicadores_M3_desarrollo_urbano', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM desarrollo_urbano');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla ordenamiento_ecologico
app.get('/indicadores_M3_ordenamiento_ecologico', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ordenamiento_ecologico');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla proteccion_civil
app.get('/indicadores_M3_proteccion_civil', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proteccion_civil');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla coordinacion_urbana
app.get('/indicadores_M3_coordinacion_urbana', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coordinacion_urbana');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla marco_normativo
app.get('/indicadores_M4_marco_normativo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marco_normativo');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla diagnostico
app.get('/indicadores_M4_diagnostico', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM diagnostico');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla acciones
app.get('/indicadores_M4_acciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM acciones');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla evaluacion
app.get('/indicadores_M4_evaluacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM evaluacion');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla preservacion
app.get('/indicadores_M5_preservacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM preservacion_del_ambiente');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla cambio_climatico
app.get('/indicadores_M5_cambio_climatico', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cambio_climatico');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla servicios_publicos_sustentables
app.get('/indicadores_M5_servicios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM servicios_publicos_sustentables');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla educacion
app.get('/indicadores_M6_educacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM educacion');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla salud
app.get('/indicadores_M6_salud', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM salud');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla grupos_vulnerables
app.get('/indicadores_M6_grupos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grupos_vulnerables');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla igualdad_de_genero
app.get('/indicadores_M6_igualdad', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM igualdad_de_genero');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla juventud
app.get('/indicadores_M6_juventud', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM juventud');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla deporte_y_recreacion
app.get('/indicadores_M6_deporte', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM deporte_y_recreacion');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la mejora_regulatoria
app.get('/indicadores_M7_mejora', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mejora_regulatoria');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla vocacion_ productiva
app.get('/indicadores_M7_vocacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vocacion_productiva');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla fomento_económico
app.get('/indicadores_M7_fomento', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fomento_economico');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla transparencia
app.get('/indicadores_M8_transparencia', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transparencia');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla participacion_ciudadana
app.get('/indicadores_M8_participacion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM participacion_ciudadana');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
// Endpoint para obtener datos de la tabla etica_publica
app.get('/indicadores_M8_etica', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM etica_publica');
    const rows = result.rows.map(row => {
      const geomBuffer = Buffer.from(row.geom, 'hex');
      const geom = wkx.Geometry.parse(geomBuffer).toGeoJSON();
      return {
        ...row,
        geom: geom
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});




// Obtener indicadores por año (dinámico)
app.get('/indicadores_modulo/:anio', async (req, res) => {
  const anio = req.params.anio;
  try {
    const result = await pool.query(`SELECT * FROM indicadores_modulo_${anio}`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error consultando la base de datos' });
  }
});

// Obtener años disponibles (opcional para selectores)
app.get('/anios_disponibles', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_name LIKE 'indicadores_modulo_%'
    `);
    const anios = result.rows.map(row => row.table_name.split('_').pop());
    res.json(anios);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener años disponibles' });
  }
});


// Endpoint básico
app.get('/', (req, res) => {
  res.send('Server is running correctly');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
