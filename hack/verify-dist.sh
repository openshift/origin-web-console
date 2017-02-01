#!/bin/bash

set -e

# We don't need grunt to be installed globally for the system,  so
# we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/grunt-cli/bin"

echo "Checking style.css perms before build:"
ls -la dist.java/java/style.css

grunt build

echo "Checking style.css perms after build:"
ls -la dist.java/java/style.css

echo "Verifying that checked in built files under dist match the source..."
if [[ $(git status -s -u dist*) ]]; then
    git status -vv -u dist*
    echo "Built dist does not match what is committed, run 'grunt build' and include the results in your commit."
    exit 1
else
    echo "Verified."
fi
