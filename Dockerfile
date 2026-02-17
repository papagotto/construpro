# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Construir el proyecto
RUN npm run build

# Etapa 2: Producción
FROM nginx:1.27-alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build a la subcarpeta para que coincida con la URL externa
COPY --from=build /app/dist /usr/share/nginx/html/prueba/construccion

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
