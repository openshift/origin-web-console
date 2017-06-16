#!/bin/bash

set -e

# We don't need grunt to be installed globally for the system,  so
# we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/grunt-cli/bin"

grunt build

echo "Verifying that checked in built files under dist match the source..."
if [[ $(git status -s -u dist*) ]]; then
    git diff --exit-code dist*
    echo "Built dist does not match what is committed, run 'grunt build' and include the results in your commit."
    exit 1
else
    echo "Verified."
fi
