# Usa una imagen oficial de Node.js como base
FROM node:16

# Configura el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de Node.js
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el resto del código fuente
COPY . .

# Expone el puerto que usará tu aplicación
EXPOSE 5000

# Comando para ejecutar tu aplicación
CMD ["npm", "start"]
