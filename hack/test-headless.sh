#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

function cleanup_xvfb() {
	if [[ -n "${xvfb_process:-}" ]]; then
		kill -SIGTERM "${xvfb_process}"
	fi
}

trap cleanup_xvfb EXIT

if ! which xdpyinfo >/dev/null 2>&1; then
	echo "[ERROR] The \`xdpyinfo\` utility is required to run this script!."
	exit 1
fi

if ! which Xvfb >/dev/null 2>&1; then
	echo "[ERROR] The \`Xvfb\` utility is required to run this script!."
	exit 1
fi

# We don't need grunt to be installed globally for the system, so
# we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/grunt-cli/bin"

echo "[INFO] Starting virtual framebuffer for headless tests..."
export DISPLAY=':10'
export SCREEN='0'
Xvfb "${DISPLAY}" -screen "${SCREEN}" 1024x768x24 -ac &
xvfb_process="$!"

while ! xdpyinfo -d "${DISPLAY}" >/dev/null 2>&1; do
	sleep 0.2
done

grunt "$@"
