#!/usr/bin/env bash

tag=v0.0.9

# workdir deploy
echo "Start Copying Files"
rm -rf .tmp
rm -rf .tls

cp -rf ../tls .tls

mkdir -p .tmp

cp -rf ../dist/404.html .tmp/404.html
cp -rf ../dist/index.html .tmp/index.html
sed -i 's/<base href="\/">/<base href="\/console\/">/g' .tmp/index.html

mkdir -p .tmp/console
cp -rf ../dist/images .tmp/console/images
cp -rf ../dist/languages .tmp/console/languages
cp -rf ../dist/scripts .tmp/console/scripts
cp -rf ../dist/styles .tmp/console/styles

cp -rf ../dist.java/java .tmp/console/java
sed -i 's/<base href="\/">/<base href="\/console\/java\/">/g' .tmp/console/java/index.html

cp -rf ../extensions/extensions.js .tmp/console/scripts/extensions.js
cp -rf ../extensions/extensions.css  .tmp/console/styles/extensions.css

cp -rf config.js.temp .tmp/console/config.js.temp

echo "Start Docker Build"
docker build -t origin-dm-web:$tag -f Dockerfile .

