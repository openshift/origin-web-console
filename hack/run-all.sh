#!/bin/bash

# Run all the important scripts in a sensible order,
# handy for switching branches, etc
wd="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$wd/clean-deps.sh &&
$wd/install-deps.sh &&
echo '[build-assets]' &&
grunt build &&
echo '[test-assets]' &&
grunt test &&
grunt test-integration
# $wd/test-integration-headless.sh &&
# $wd/verify-dist.sh
