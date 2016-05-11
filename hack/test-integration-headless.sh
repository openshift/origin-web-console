#!/bin/bash

set -e

echo "[INFO] Starting virtual framebuffer for headless tests..."
export DISPLAY=:10
Xvfb :10 -screen 0 1024x768x24 -ac &

grunt test-integration