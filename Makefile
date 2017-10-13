.DEFAULT_GOAL := build

# Pull in dependencies
#
# Examples:
#   make install
install:
	hack/install-deps.sh
.PHONY: install

# Clean up all dependencies
#
# Args:
#   GRUNT_FLAGS: Extra flags to pass to 'grunt test'
#
# Example:
#   make clean
#   make test GRUNT_FLAGS='--stack'
clean:
	grunt clean $(GRUNT_FLAGS)
	hack/clean-deps.sh
.PHONY: clean

# Run `grunt build`
#
# Args:
#   GRUNT_FLAGS: Extra flags to pass to 'grunt build'
#
# Examples:
#   make build
#   make build GRUNT_FLAGS='--verbose'
build: install
	grunt build $(GRUNT_FLAGS)
.PHONY: build

# Run all tests
#
# Args:
#   GRUNT_FLAGS: Extra flags to pass to 'grunt test'
#
# Examples:
#   make test
#   make test GRUNT_FLAGS='--gruntfile=~/special/Gruntfile.js'
#   make test GRUNT_UNIT_TEST_FLAGS='--browser=chrome' GRUNT_INTEGRATION_TEST_FLAG='--foo'
test: build
	hack/verify-dist.sh
	hack/test-headless.sh test-unit $(GRUNT_UNIT_TEST_FLAGS)
	hack/test-headless.sh test-integration $(GRUNT_INTEGRATION_TEST_FLAGS)
.PHONY: test
