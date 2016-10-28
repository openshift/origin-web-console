#!/bin/bash

set -e

# We don't need bower to be installed globally for the system, so 
# we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/bower/bin"

if which bower > /dev/null 2>&1 ; then
  # In case upstream components change things without incrementing versions
  echo "Clearing bower cache..."
  bower cache clean --allow-root
else
  echo "Skipping bower cache clean, bower not installed."
fi

echo "Cleaning up bower_components and node_modules..."
rm -rf bower_components/* node_modules/*
