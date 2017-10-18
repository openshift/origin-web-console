'use strict';

let wait = require('./wait');

exports.expectAlert = (msg) => {
  let elem = element(by.css('.alert'));
  wait.forElem(elem);
  expect(elem.getText()).toEqual('error\n' + msg);
};

exports.expectHeading = (text, level) => {
  let elem = element.all(by.css(level || '.middle h1'));
  wait.forElem(elem);
  expect(elem.first().getText()).toEqual(text);
};

// on some pages we hide help links within the heading,
// this lets the assert be a little more fuzzy and ignore extra markup
exports.expectHeadingContainsText = (partialText, caseSensitive, level) => {
  let elem = element.all(by.css(level || '.middle h1'));
  wait.forElem(elem);
  elem.first().getText().then((text) => {
    let toMatch = caseSensitive ? partialText : partialText.toLowerCase();
    text = caseSensitive ? text : text.toLowerCase();
    expect(text).toContain(toMatch);
  });
};

exports.expectElementToExist = (elem) => {
  expect(elem.isPresent()).toBe(true);
};

exports.expectElementToBeVisible = (elem) => {
  wait.forElem(elem);
  expect(elem.isDisplayed()).toBeTruthy();
};

exports.expectElementToBeHidden = (elem) => {
  wait.forElem(elem);
  expect(elem.isDisplayed()).toBeFalsy();
};

exports.expectPageUrl = (pageUrl) => {
  browser.getCurrentUrl().then((actualUrl) => {
    // NOTE: this uses contains instead of equals
    // to avoid worrying about query string inconsistencies, etc.
    // we can add a flag for exact matching if there comes a
    // point when it would be helpful.
    expect(actualUrl).toContain(pageUrl);
  });
};
