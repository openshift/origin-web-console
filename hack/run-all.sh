#!/bin/bash

# This script is for local development usage & will run the
# entire clean/build/install/test flow in order.

set -o errexit
set -o nounset
set -o pipefail

OS_ROOT=$(dirname "${BASH_SOURCE}")/..
${OS_ROOT}/hack/clean-deps.sh
${OS_ROOT}/hack/install-deps.sh
echo '[build-assets]'
grunt build
echo '[test-assets]'
# SKIP_TESTS flag
#if !-o SKIP_TESTS; then
  grunt test
  grunt test-integration
#fi
# $wd/test-integration-headless.sh &&
# $wd/verify-dist.sh
