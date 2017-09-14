'use strict';

var EC = protractor.ExpectedConditions;
var timing = require('./timing');

exports.forElem = (elem) => {
  var selector = elem.locator().toString();
  var errorMessage = `Element taking too long to appear in the DOM: ${selector}`;
  return browser.wait(EC.presenceOf(elem), timing.maxWaitForElement, errorMessage);
};

exports.forClickableElem = (elem) => {
  var selector = elem.locator().toString();
  var errorMessage = `Element taking too long to become clickable: ${selector}`;
  return browser.wait(EC.elementToBeClickable(elem), timing.maxWaitForElement, errorMessage);
};
