#!/usr/bin/env bash

tag=$VERSION

# workdir deploy
echo "Start Copying Files"

mkdir -p /usr/share/nginx/html/console

sed -i 's/<base href="\/">/<base href="\/console\/">/g' /usr/share/nginx/html/index.html
sed -i "s#<script src=\"scripts/extensions.js\"></script>#<script src=\"scripts/extensions.js\"></script>\n<input type=\"hidden\" name=\"openshift-version\" value=\"v3.6.1\"/>\n<input type=\"hidden\" name=\"dmos-version\" value=\"$tag\">#g" /usr/share/nginx/html/index.html

mv -f /usr/share/nginx/html/images /usr/share/nginx/html/console/images
mv -f /usr/share/nginx/html/languages /usr/share/nginx/html/console/languages
mv -f /usr/share/nginx/html/scripts /usr/share/nginx/html/console/scripts
mv -f /usr/share/nginx/html/styles /usr/share/nginx/html/console/styles

sed -i 's/<base href="\/">/<base href="\/console\/java\/">/g' /usr/share/nginx/html/console/java/index.html

cp -rf /usr/share/nginx/html/extensions/extensions.js /usr/share/nginx/html/console/scripts/extensions.js
cp -rf /usr/share/nginx/html/extensions/extensions.css  /usr/share/nginx/html/console/styles/extensions.css

cp -rf /deploy/config.js.temp /usr/share/nginx/html/console/config.js.temp
cp -rf /deploy/nginx.conf /etc/nginx/nginx.conf
cp -rf /deploy/default.conf.temp /etc/nginx/conf.d/default.conf.temp
