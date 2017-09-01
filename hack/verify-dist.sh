#!/bin/bash

set -e

RED='\033[0;31m'
NOCOLOR='\033[0m'
GREEN='\033[0;32m'

# We don't need grunt to be installed globally for the system,  so
# we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/grunt-cli/bin"

grunt build

echo "Verifying that checked in built files under dist match the source..."
if [[ $(git status -s -u dist*) ]]; then
    echo -e "${RED}Built /dist does not match what is committed, run 'grunt build' and include the results in your commit.${NOCOLOR}"
    git diff --exit-code dist*
    exit 1
else
    echo -e "${GREEN}Verified. Rebuilt /dist matches what has been committed.${NOCOLOR}"
fi
