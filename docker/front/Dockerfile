# Utilizar la imagen base de nginx
FROM nginx:alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/share/nginx/html

# Eliminar los archivos existentes de la imagen base de nginx
RUN rm -rf ./*

# Copiar los archivos compilados de Angular al directorio de nginx
COPY ./ .

# Exponer el puerto 80 para servir la aplicación Angular
EXPOSE 80
CMD sh -c 'echo "window[\"env\"] = { apiUrl: \"'$API_URL'\" };" > /usr/share/nginx/html/assets/env.js && nginx -g "daemon off;"'