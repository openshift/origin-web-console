'use strict';

// example:
//  scroll.toBottom().then(function() { /* do work */  });
exports.toBottom = () => {
  return browser.executeScript('window.scrollTo(0,document.body.scrollHeight);');
};

exports.toTop = () => {
  return browser.executeScript('window.scrollTo(0,0);');
};
