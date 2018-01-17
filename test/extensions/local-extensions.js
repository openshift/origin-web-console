'use strict';

/*
 * This file contains extensions scripts for integration test only. They are
 * not included in the built dist.
 */

// Required for user_creates_from_url_spec.js which tests the create from URL whitelist.
window.OPENSHIFT_CONSTANTS.CREATE_FROM_URL_WHITELIST.push('template-dumpster');
