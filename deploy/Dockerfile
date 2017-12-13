FROM nginx:1.13.6-alpine

RUN apk add --update bash \
  && touch /root/.bashrc

COPY .tmp /usr/share/nginx/html

COPY .tls /tls

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf.temp /etc/nginx/conf.d/default.conf.temp
COPY start.sh /start.sh

CMD ["bash", "/start.sh"]
