# Etapa 1: Construcción
FROM node:20-alpine AS build

WORKDIR /app

# Copiamos archivos de dependencias para aprovechar la caché de capas de Docker
COPY package*.json ./
RUN npm install

# Copiamos el código fuente y generamos el build
COPY . .
RUN npm run build

# Etapa 2: Servidor de producción ligero
FROM nginx:stable-alpine

# Copiamos el build a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (interno del contenedor)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
