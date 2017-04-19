#!/bin/bash

set -e

OPENSHIFT_JVM_VERSION=v1.1.6

STARTTIME=$(date +%s)

TMPDIR="${TMPDIR:-"/tmp"}"
LOG_DIR="${LOG_DIR:-$(mktemp -d ${TMPDIR}/openshift.assets.logs.XXXX)}"

function cmd() {
  local cmd="$1"
  local tries="${2:-1}"
  local log_file=$(mktemp ${LOG_DIR}/install-assets.XXXX)
  echo "[install-assets] ${cmd}"
  rc="0"
  while [[ "$tries" -gt 0 ]]; do
    rc="0"
    $cmd &> ${log_file} || rc=$?
    [[ "$rc" == "0" ]] && cat ${log_file} && return 0
    ((tries--))
  done
  echo "[ERROR] Command '${cmd}' failed with rc ${rc}, logs:" && cat ${log_file}
  exit $rc
}

# We don't need grunt and bower to be installed globally for the system,
# so we can amend our path to look into the local node_modules for the
# correct binaries.
repo_root="$( dirname "${BASH_SOURCE}" )/.."
export PATH="${PATH}:${repo_root}/node_modules/bower/bin:${repo_root}/node_modules/grunt-cli/bin"

# Install bower if needed
if ! which bower > /dev/null 2>&1 ; then
  cmd "npm install bower"
fi

# Install grunt if needed
if ! which grunt > /dev/null 2>&1 ; then
  cmd "npm install grunt-cli"
fi

cmd "npm install --unsafe-perm"

# For debugging...
cmd "npm list"

# In case upstream components change things without incrementing versions
cmd "bower cache clean --allow-root"
cmd "bower update --allow-root" 3

cmd "rm -rf openshift-jvm"
cmd "mkdir -p openshift-jvm"
unset CURL_CA_BUNDLE
curl -s https://codeload.github.com/hawtio/openshift-jvm/tar.gz/${OPENSHIFT_JVM_VERSION}-build | tar -xz -C openshift-jvm --strip-components=1

ret=$?; ENDTIME=$(date +%s); echo "$0 took $(($ENDTIME - $STARTTIME)) seconds"; exit "$ret"
