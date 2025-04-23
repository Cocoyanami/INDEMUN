#!/bin/bash

DB_HOST="localhost"
DB_USER="postgres"
DB_PASSWORD="user" #contraseña de la base de datos
DB_DATABASE="INDEMUN" #nombre de la base de datos

# === FUNCIONALIDAD OPCIONAL: eliminar todas las tablas existentes ===
function drop_all_tables() {
  echo "Eliminando todas las tablas existentes en la base de datos $DB_DATABASE..."
  tables=$(psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
  
  for table in $tables; do
    echo "Eliminando tabla $table..."
    psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "DROP TABLE IF EXISTS \"$table\" CASCADE;"
  done
  echo "Todas las tablas han sido eliminadas."
}

# Descomenta la siguiente línea si quieres eliminar todas las tablas antes de cargar nuevas
# drop_all_tables

# === CARGA DE ARCHIVOS GEOJSON ===
echo "Archivos GeoJSON disponibles en /data/db:"
ls /data/db/*.geojson

for file in /data/db/*.geojson; do
  table_name=$(basename "$file" .geojson)
  echo "Cargando $file en la tabla $table_name..."
  ogr2ogr -f "PostgreSQL" PG:"host=$DB_HOST user=$DB_USER dbname=$DB_DATABASE password=$DB_PASSWORD" \
  "$file" -lco FID="id" -lco GEOMETRY_NAME="geom" -lco LAUNDER="NO" -nln "$table_name" -nlt GEOMETRY -overwrite

  if [ $? -eq 0 ]; then
    echo "Tabla $table_name cargada exitosamente."
    psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "ALTER TABLE \"$table_name\" RENAME COLUMN wkb_geometry TO geom;"
  else
    echo "Error al cargar la tabla $table_name."
  fi
done

# === CARGA DE INDICADORES MULTIANUALES ===
for csv_file in /data/db/indicadores_modulo_*.csv; do
  table_name=$(basename "$csv_file" .csv)
  echo "Cargando $csv_file en la tabla $table_name..."

  psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "DROP TABLE IF EXISTS \"$table_name\";"

  psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "
  CREATE TABLE \"$table_name\" (
    \"Municipio\" text,
    \"M1_V\" float8, \"M1_a\" float8, \"M1_r\" float8, \"M1_ndR\" float8, \"M1_nd\" float8, \"M1_nm\" float8,
    \"M2_v\" float8, \"M2_a\" float8, \"M2_r\" float8, \"M2_ndR\" float8, \"M2_nd\" float8, \"M2_nm\" float8,
    \"M3_v\" float8, \"M3_a\" float8, \"M3_r\" float8, \"M3_ndR\" float8, \"M3_nd\" float8, \"M3_nm\" float8,
    \"M4_v\" float8, \"M4_a\" float8, \"M4_r\" float8, \"M4_ndR\" float8, \"M4_nd\" float8, \"M4_nm\" float8,
    \"M5_v\" float8, \"M5_a\" float8, \"M5_r\" float8, \"M5_ndR\" float8, \"M5_nd\" float8, \"M5_nm\" float8,
    \"M6_v\" float8, \"M6_a\" float8, \"M6_r\" float8, \"M6_ndR\" float8, \"M6_nd\" float8, \"M6_nm\" float8,
    \"M7_v\" float8, \"M7_a\" float8, \"M7_r\" float8, \"M7_ndR\" float8, \"M7_nd\" float8, \"M7_nm\" float8,
    \"M8_v\" float8, \"M8_a\" float8, \"M8_r\" float8, \"ndR\" float8, \"M8_nd\" float8, \"M8_nm\" float8,
    \"T_v\" float8, \"T_a\" float8, \"T_r\" float8, \"T_ndR\" float8, \"T_nd\" float8, \"T_nm\" float8
  );"

  psql -h $DB_HOST -U $DB_USER -d $DB_DATABASE -c "\copy \"$table_name\" FROM '$csv_file' WITH (FORMAT csv, HEADER true, DELIMITER ',', QUOTE '\"');"

  if [ $? -eq 0 ]; then
    echo "Datos cargados en $table_name."
  else
    echo "Error al cargar datos en $table_name."
  fi
done
