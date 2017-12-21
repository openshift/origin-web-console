#! /bin/bash

# replace nginx config
NGINX_CONF_TEMP=/etc/nginx/conf.d/default.conf.temp
NGINX_CONF_FILE=/etc/nginx/conf.d/default.conf

cp -f $NGINX_CONF_TEMP $NGINX_CONF_FILE

echo "LISTEN_HOST $LISTEN_HOST"
echo "LISTEN_PORT $LISTEN_PORT"
echo "LOGGING_URL $LOGGING_URL"
echo "METRICS_URL $METRICS_URL"
echo "MASTER_HOST $MASTER_HOST"

echo "sed js LISTEN_PORT start"
if [ $LISTEN_PORT ]
then
sed -i "s#{{PORT}}#$LISTEN_PORT#g" $NGINX_CONF_FILE
else
sed -i "s#{{PORT}}#9000#g" $NGINX_CONF_FILE
fi
echo "sed nginx LISTEN_PORT success"

echo "sed js MASTER_HOST start"
if [ $MASTER_HOST ]
then
arr_master=(${MASTER_HOST//;/ })
upstreamConfig=""
for i in ${arr_master[@]}
do
echo "$i is a master."
upstreamConfig="$upstreamConfig    server $i;\n"
done
sed -i "s#{{upstream_config}}#$upstreamConfig#g" $NGINX_CONF_FILE
else
sed -i "" $NGINX_CONF_FILE
fi
echo "sed nginx MASTER_HOST success"

# replace js config
JS_CONF_TEMP=/usr/share/nginx/html/console/config.js.temp
JS_CONF_FILE=/usr/share/nginx/html/console/config.js

cp -f $JS_CONF_TEMP $JS_CONF_FILE

echo "sed js LISTEN_HOST start"
if [ $LISTEN_HOST ]
then
sed -i "s#{{MASTER_HOST}}#$LISTEN_HOST#g" $JS_CONF_FILE
sed -i "s#{{CONSOLE_HOST}}#$LISTEN_HOST#g" $JS_CONF_FILE
else
sed -i "s#{{MASTER_HOST}}##g" $JS_CONF_FILE
sed -i "s#{{CONSOLE_HOST}}##g" $JS_CONF_FILE
fi
echo "sed js LISTEN_HOST success"

echo "sed js LOGGING_URL start"
if [ $LOGGING_URL ]
then
sed -i "s#{{LOGGING_URL}}#$LOGGING_URL#g" $JS_CONF_FILE
else
sed -i "s#{{LOGGING_URL}}##g" $JS_CONF_FILE
fi
echo "sed js LOGGING_URL success"

echo "sed js METRICS_URL start"
if [ $METRICS_URL ]
then
sed -i "s#{{METRICS_URL}}#$METRICS_URL#g" $JS_CONF_FILE
else
sed -i "s#{{METRICS_URL}}##g" $JS_CONF_FILE
fi
echo "sed js METRICS_URL success"

echo "nginx start"
sh -c "nginx -g \"daemon off;\""


