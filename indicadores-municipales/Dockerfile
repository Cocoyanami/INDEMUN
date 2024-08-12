# Fase de construcción
FROM node:16 as build-stage

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente y construye la aplicación
COPY . .
RUN npm run build

# Fase de producción
FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
