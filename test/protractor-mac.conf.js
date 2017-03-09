// Reference Configuration File
//
// This file shows all of the configuration options that may be passed
// to Protractor.
var _ = require('lodash');
var baseConf = require('./protractor.conf').config;

// overrides to the base protractor.conf to use gecko.driver on mac
exports.config = _.extend({}, baseConf, {
  seleniumArgs: ['-Dwebdriver.gecko.driver=./node_modules/geckodriver/geckodriver'],
  capabilities: {
    name: 'Unnamed Job',
    count: 1,
    shardTestFiles: false,
    maxInstances: 1,
    marionette: true,
    acceptInsecureCerts: true
  }
});
