#!/bin/bash

set -e

if which yarn > /dev/null 2>&1 ; then
  # In case upstream components change things without incrementing versions
  echo "Clearing yarn cache..."
  yarn cache clean
else
  echo  "Skipping yarn cache clean. Yarn not installed."
fi

echo "Cleaning up node_modules..."
rm -rf node_modules/*
