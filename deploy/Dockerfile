FROM nginx:1.13.6-alpine

COPY ./dist/404.html /usr/share/nginx/html/404.html
COPY ./dist/index.html /usr/share/nginx/html/index.html

COPY ./dist/images /usr/share/nginx/html/console/images
COPY ./dist/languages /usr/share/nginx/html/console/languages
COPY ./dist/scripts /usr/share/nginx/html/console/scripts
COPY ./dist/styles /usr/share/nginx/html/console/styles

COPY ./extensions/extensions.js /usr/share/nginx/html/console/scripts/extensions.js
COPY ./extensions/extensions.css  /usr/share/nginx/html/console/styles/extensions.css
COPY ./tls /tls
#COPY ./app/config.local.js /user/share/nginx/html/console/config.js

COPY ./deploy/nginx.conf /etc/nginx/nginx.conf
COPY ./deploy/default.conf /etc/nginx/conf.d/default.conf

