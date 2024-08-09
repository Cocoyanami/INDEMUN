# Sistema Hidalguense de Indicadores municipales INDEMUN Hidalgo

## Descripción
Este proyecto muestra el valor de los indicadores tanto en un mapa como en gráficos interactivos. Es una iniciativa desarrollada por la Dirección General de Análisis Geográfico y Mejora a las Políticas Públicas, perteneciente al Gobierno del Estado de Hidalgo, México.

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu_usuario/tu_repositorio.git
    ```

2. Navega al directorio del proyecto:
    ```bash
    cd tu_repositorio
    ```

3. Instala las dependencias:
    ```bash
    npm install
    ```

4. Inicia el servidor de desarrollo:
    ```bash
    npm start
    ```

## Uso

- Abre tu navegador web y ve a `http://localhost:3000` para ver la aplicación en funcionamiento.
- Navega a través del mapa interactivo y gráficos para explorar los indicadores municipales.

## Despliegue en producción de la Plataforma de Indicadores

1. **Clonar el Repositorio:**
   - Clonar el repositorio en el servidor.

2. **Configuración del Archivo `.env`:**
   - Crear un archivo `.env` en la carpeta `server/` con las licencias de tu base de datos PostgreSQL, ejemplo:
     ```plaintext
     DB_HOST=db (no modificar db!)
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=yourpassword
     DB_DATABASE=INDEMUN
     ```

3. **Construir y Ejecutar los Contenedores:**
   - Navegar al directorio raíz del proyecto y ejecutar:
     ```bash
     docker-compose up --build
     ```

4. **Acceso a la Aplicación:**
   - La aplicación estará disponible en [http://localhost:3000](http://localhost:3000) para el frontend y en [http://localhost:5000](http://localhost:5000) para la API.


## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para más información, puedes contactar a la Dirección General de Análisis Geográfico y Mejora a las Políticas Públicas del Gobierno del Estado de Hidalgo.

http://sigeh.hidalgo.gob.mx/

Desarrollador:jesus.paredez@hidalgo.gob.mx

---
