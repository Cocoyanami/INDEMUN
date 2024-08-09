const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Configura la conexión a PostgreSQL
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect();

// Función para cargar archivos CSV
const loadCSV = (filePath, tableName) => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (row) => {
      const keys = Object.keys(row);
      const values = keys.map(key => `'${row[key]}'`).join(',');
      const query = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${values})`;
      await client.query(query);
    })
    .on('end', () => {
      console.log(`Datos de ${filePath} cargados en la tabla ${tableName}`);
    });
};

// Función para cargar archivos GeoJSON
const loadGeoJSON = (filePath, tableName) => {
  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) {
      console.error(`Error leyendo el archivo ${filePath}:`, err);
      return;
    }
    const geojson = JSON.parse(data);
    for (const feature of geojson.features) {
      const columns = Object.keys(feature.properties).join(', ');
      const values = Object.values(feature.properties).map(val => `'${val}'`).join(', ');
      const geom = JSON.stringify(feature.geometry);
      const query = `
        INSERT INTO ${tableName} (${columns}, geom)
        VALUES (${values}, ST_GeomFromGeoJSON('${geom}'));
      `;
      await client.query(query);
    }
    console.log(`Datos de ${filePath} cargados en la tabla ${tableName}`);
  });
};

// Cargar archivos CSV
loadCSV(path.join(__dirname, '../db/indicadores_modulo_2023.csv'), 'indicadores_modulo');

// Cargar archivos GeoJSON
loadGeoJSON(path.join(__dirname, '../db/tabla_geojson_1.geojson'), 'tabla_geojson_1');
loadGeoJSON(path.join(__dirname, '../db/tabla_geojson_2.geojson'), 'tabla_geojson_2');

// Cierra la conexión al terminar
client.end();
