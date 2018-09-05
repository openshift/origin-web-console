#!/bin/bash

set -e
# show everything the shell is doing in case exit 1 isn't called on a fail
# this is very noisy
# set -o xtrace

source "$(dirname "${BASH_SOURCE}")/lib/init.sh"

# We don't need grunt to be installed globally for the system,  so
# we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/grunt-cli/bin"

# vars to generate a fake junit test output file
TIMESTAMP=$(date +"%x %r %Z")
SUITE_NAME="$BASH_SOURCE/$FILE"
TEST_NAME="User should generate /dist by running grunt build"
TESTS_COUNT=1
SKIPPED_COUNT=0
DISABLED=0
FAILURE_COUNT=0
ERROR_COUNT=0
PASSED=false
POTENTIAL_FAILED_TEST=""

# run the build to generate dist
os::log::info "Rebuilding dist..."
grunt build

# validate generated against what is committed
os::log::info "Verifying that checked in built files under dist match the source..."
GIT_STATUS="$( git status --short --untracked-files -- dist/ )"
GIT_DIFF="$( git diff )"

# -n = not null
if [[ -n "$GIT_STATUS" ]]; then
  FAILURE_COUNT=1
  FAILURE_MESSAGE="Built /dist does not match what is committed, run grunt build and include the results in your commit."
  ERROR_COUNT=1
  POTENTIAL_FAILED_TEST="<failure type=\"DIST_FAILURE\" message=\"$FAILURE_MESSAGE\"><![CDATA[ $GIT_DIFF ]]></failure>"
  PASSED=false
else
  PASSED=true
fi

# generate a dummy junit style xml file for better CI output
DEST_OUTPUT_PATH="${repo_root}/test/junit/"
DEST_OUTPUT_FILE="${DEST_OUTPUT_PATH}/verify-dist.xml"

mkdir -p "${DEST_OUTPUT_PATH}"

# print the results
cat <<END_OF_XML >"${DEST_OUTPUT_FILE}"
<?xml version="1.0" encoding="UTF-8" ?>
<testsuites>
  <properties>
    <property name="skuznets" value="is amazing"/>
  </properties>
  <testsuite
    name="$SUITE_NAME"
    timestamp="$TIMESTAMP"
    errors="$ERROR_COUNT"
    tests="$TESTS_COUNT"
    skipped="$SKIPPED_COUNT"
    disabled="$DISABLED"
    failures="$FAILURE_COUNT"
    time="1">
    <testcase
      classname="$SUITE_NAME"
      name="$TEST_NAME"
      time="1">
      $POTENTIAL_FAILED_TEST
    </testcase>
  </testsuite>
</testsuites>
END_OF_XML

# finally, print results message & write the file
if [[ "${PASSED}" == "true" ]]; then
  os::log::success "Verified. Rebuilt /dist matches what has been committed."
else
  os::log::fatal "Built /dist does not match what is committed, run 'grunt build' and include the results in your commit."
  git diff --exit-code dist*
  exit 1
fi
