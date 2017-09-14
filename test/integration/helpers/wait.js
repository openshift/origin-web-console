'use strict';

var until = protractor.ExpectedConditions;

exports.forElem = (elem) => {
  browser.wait(until.presenceOf(elem), 5000, 'Element taking too long to appear in the DOM');
};
