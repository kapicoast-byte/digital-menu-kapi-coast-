FROM nginx:alpine
COPY qr-menu-app/public/ /usr/share/nginx/html/
EXPOSE 80
