#!/bin/bash

set -e

echo "[INFO] Starting virtual framebuffer for headless tests..."
export DISPLAY=:10
Xvfb :10 -screen 0 1024x768x24 -ac &

# make this work generically for any cmd we pass it, not just grunt test-integrations
# as a new script not called test-ingration-headless / repmove this one
# look @ Makefile where i left notes
# vagrant-openshift project, look at run_origin_asset_tests.rb as well cuz "stuff"
# talk to Steve, get vagrant-openshift calling the Makefile correctly first, then my PR
grunt test-integration "$@"
