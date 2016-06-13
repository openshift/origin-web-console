'use strict';

var browse = require('./browser.js');
var win = require('./window.js');

var setup = function() {
    win.resize(1024, 2048);
};

var tearDown = function() {
  win.clearStorage();
};

var afterAllTearDown = function() {
  tearDown();
  browse.sleep();
};

exports.setup = setup;
exports.tearDown = tearDown;
exports.afterAllTearDown = afterAllTearDown;
