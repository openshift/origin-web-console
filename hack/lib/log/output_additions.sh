#!/bin/bash

# This file contains additional functions to output.sh that do not
# exist in openshift/origin

# os::log::success writes the message to stdout.
# A warning indicates something went wrong but
# not so wrong that we cannot recover.
#
# Arguments:
#  - all: message to write
function os::log::success() {
	local message; message="$( os::log::internal::prefix_lines "[SUCCESS]" "$*" )"
	os::log::internal::to_logfile "${message}"
	os::text::print_green "${message}" 1>&2
}
readonly -f os::log::success
