#!/bin/bash

set -e

echo "[clean-assets]"
echo "Cleaning up bower_components and node_modules..."
rm -rf bower_components/*
rm -rf node_modules/*

if which bower > /dev/null 2>&1 ; then
  # In case upstream components change things without incrementing versions
  echo "Clearing bower cache..."
  bower cache clean --allow-root
else
  echo "Skipping bower cache clean, bower not installed."
fi
