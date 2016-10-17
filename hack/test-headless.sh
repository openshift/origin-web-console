#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

echo "[INFO] Starting virtual framebuffer for headless tests..."
export DISPLAY=':10'
export SCREEN='0'
Xvfb "${DISPLAY}" -screen "${SCREEN}" 1024x768x24 -ac &

# Debian versions of `xrandr` want `-display` whereas RPM
# versions want `--display`, so we'll just use `-d` to
# support both.
while ! xrandr -d "${DISPLAY}" --screen "${SCREEN}" >/dev/null 2>&1; do
	sleep 0.2
done

grunt "$@"
