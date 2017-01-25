'use strict';

// example:
//  scroll.toBottom().then(function() { /* do work */  });
exports.toBottom = function() {
  return browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');
};

exports.toTop = function() {
  return browser.executeScript('window.scrollTo(0,0);');
};
