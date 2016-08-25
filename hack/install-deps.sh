#!/bin/bash

set -e

OPENSHIFT_JVM_VERSION=v1.0.45

STARTTIME=$(date +%s)
#OS_ROOT=$(dirname "${BASH_SOURCE}")/..
#source "${OS_ROOT}/hack/common.sh"

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
    [[ "$rc" == "0" ]] && return 0
    ((tries--))
  done
  echo "[ERROR] Command '${cmd}' failed with rc ${rc}, logs:" && cat ${log_file}
  exit $rc
}

# Install bower if needed
if ! which bower > /dev/null 2>&1 ; then
  cmd "sudo npm install -g bower"
fi

# Install grunt if needed
if ! which grunt > /dev/null 2>&1 ; then
  cmd "sudo npm install -g grunt-cli"
fi

cmd "npm install --unsafe-perm"

# In case upstream components change things without incrementing versions
cmd "bower cache clean --allow-root"
cmd "bower update --allow-root" 3

cmd "rm -rf openshift-jvm"
cmd "mkdir -p openshift-jvm"
unset CURL_CA_BUNDLE
curl -s https://codeload.github.com/hawtio/openshift-jvm/tar.gz/${OPENSHIFT_JVM_VERSION}-build | tar -xz -C openshift-jvm --strip-components=1

# Fix branding for OCP
indexHtml='openshift-jvm/index.html'
# TODO Check and make sure these replacements made it into openshift-jvm/index.html
sed -i '' 's/class="navbar-brand"/class="navbar-brand" style="padding-top: 6px; padding-bottom: 5px;"/' $indexHtml
sed -i '' 's/img\/logo-origin-thin\.svg"/..\/images\/logo-OCP-console-hdr-thin\.svg" style="height: 13px;"/' $indexHtml
sed -i '' 's/<title>openshift-jvm<\/title>/<title>OpenShift Container Platform JVM Console<\/title>/' $indexHtml


ret=$?; ENDTIME=$(date +%s); echo "$0 took $(($ENDTIME - $STARTTIME)) seconds"; exit "$ret"
