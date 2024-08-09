# Sistema Hidalguense de Indicadores Municipales (INDEMUN Hidalgo)

## Descripción
Este proyecto muestra el valor de los indicadores tanto en un mapa como en gráficos interactivos. Es una iniciativa desarrollada por la Dirección General de Análisis Geográfico y Mejora a las Políticas Públicas, perteneciente al Gobierno del Estado de Hidalgo, México.

## Instalación y Ejecución 

### Opción 1: Usando Docker (Recomendado)

1. **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/JesusParedes25/indemun-hidalgo.git
    ```

2. **Navegar al Directorio del Proyecto:**
    ```bash
    cd indemun-hidalgo
    ```

3. **Configuración del Archivo `.env`:**
   - Crear un archivo `.env` en la carpeta `server/` con la siguiente configuración:
     ```plaintext
     DB_HOST=db
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=yourpassword
     DB_DATABASE=INDEMUN
     ```

4. **Construir y Ejecutar los Contenedores:**
    ```bash
    docker-compose up --build
    ```

5. **Acceder a la Aplicación:**
   - Abre tu navegador y ve a `http://localhost:3000` para ver el frontend.
   - La API del backend estará disponible en `http://localhost:5000`.

6. **Detener los Contenedores:**
    ```bash
    docker-compose down
    ```

### Opción 2: Sin Docker

1. **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/JesusParedes25/indemun-hidalgo.git
    ```

2. **Navegar al Directorio del Proyecto:**
    ```bash
    cd tu_repositorio
    ```

3. **Instalar Node.js y PostgreSQL**:
   - Descargar e instalar [Node.js](https://nodejs.org/).
   - Descargar e instalar [PostgreSQL](https://www.postgresql.org/download/).

4. **Configurar la Base de Datos**:
   - Crear una base de datos en PostgreSQL y ajustar las variables de entorno en el archivo `.env` en la carpeta `server/`:
     ```plaintext
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=yourpassword
     DB_DATABASE=INDEMUN
     ```

5. **Instalar Dependencias del Backend**:
    ```bash
    cd server
    npm install
    ```

6. **Instalar Dependencias del Frontend**:
    ```bash
    cd ../indicadores-municipales
    npm install
    ```

7. **Cargar los Datos en PostgreSQL**:
   - Ejecutar el script de carga de datos en PostgreSQL (`loadData.js`) para cargar los archivos GeoJSON y CSV:
     ```bash
     node loadData.js
     ```

8. **Iniciar el Backend**:
    ```bash
    cd ../server
    npm start
    ```

9. **Iniciar el Frontend**:
    ```bash
    cd ../indicadores-municipales
    npm start
    ```

10. **Acceder a la Aplicación**:
    - Abre tu navegador y ve a `http://localhost:3000` para ver la aplicación en funcionamiento.

## Uso

- Abre tu navegador web y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.
- Navega a través del mapa interactivo y gráficos para explorar los indicadores municipales.


## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para más información, puedes contactar a la Dirección General de Análisis Geográfico y Mejora a las Políticas Públicas del Gobierno del Estado de Hidalgo.

http://sigeh.hidalgo.gob.mx/

Desarrollador: jesus.paredez@hidalgo.gob.mx
