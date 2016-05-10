#!/bin/bash

set -e

grunt build

echo "Verifying that checked in built files under dist match the source..."
if [[ $(git status -s -u dist*) ]]; then
    echo "Built dist does not match what is committed, run 'grunt build' and include the results in your commit."
    exit 1
else
    echo "Verified."
fi