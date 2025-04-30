# Sistema Hidalguense de Indicadores Municipales (INDEMUN Hidalgo)

## Descripción
Este proyecto muestra el valor de los indicadores tanto en un mapa como en gráficos interactivos. Es una iniciativa desarrollada por la Dirección General de Análisis Geográfico y Mejora a las Políticas Públicas, perteneciente al Gobierno del Estado de Hidalgo, México.

## Instalación y Ejecución

### Opción 1: Usando Docker (Recomendado)

1. **Clonar el Repositorio:**
    ```bash
    git clone 'https://github.com/Cocoyanami/INDEMUN.git'
    ```

2. **Navegar al Directorio del Proyecto:**
    ```bash
    cd indemun-hidalgo
    ```

3. **Configurar las Credenciales en `docker-compose.yml` y `load_geojson.sh`:**
   - En el archivo `docker-compose.yml`, asegúrate de actualizar las credenciales de la base de datos en las secciones de `environment` para los servicios `backend` y `db`.
   - En el script `load_geojson.sh` (ubicado en `db/init-scripts/`), asegúrate de que las credenciales de la base de datos estén actualizadas.

4. **Construir y Ejecutar los Contenedores:**
    ```bash
    sudo docker-compose up --build
    ```

5. **Inicializar la Base de Datos con Datos GeoJSON y CSV:**
   - En una terminal separada, ingresa al contenedor de la base de datos que está en ejecución:
     ```bash
     sudo docker exec -it indemun-hidalgo-db-1 bash

     ```
   - Ejecuta el script para cargar los datos GeoJSON y CSV en la base de datos:
     ```bash
     bash /docker-entrypoint-initdb.d/load_geojson.sh
     ```

6. **Acceder a la Aplicación:**
   - Abre tu navegador y ve a `http://localhost:3000` para ver el frontend.
   - La API del backend estará disponible en `http://localhost:5000`.

7. **Detener los Contenedores:**
    ```bash
    sudo docker-compose down
    ```

## Uso

- Abre tu navegador web y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.
- Navega a través del mapa interactivo y gráficos para explorar los indicadores municipales.

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para más información, puedes contactar a la Dirección General de Análisis Geográfico y Mejora a las Políticas Públicas del Gobierno del Estado de Hidalgo.

http://sigeh.hidalgo.gob.mx/

Desarrollador: jesus.paredez@hidalgo.gob.mx



modificado por cocoyanomami@gmail.com
