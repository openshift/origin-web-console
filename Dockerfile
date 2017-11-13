FROM digitallyseamless/nodejs-bower-grunt:5

COPY . /data

EXPOSE 9000

CMD ["/bin/sh", "-c", "grunt",  "serve", "--hostname=0.0.0.0", "--port=9000", "--contextRoot=console"]
