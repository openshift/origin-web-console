'use strict';

exports.expectAlert = (msg) => {
  expect(element(by.css('.alert')).getText()).toEqual('error\n' + msg);
};

exports.expectHeading = (text, level) => {
  expect(element(by.css(level || '.middle-container h1')).getText()).toEqual(text);
};

exports.expectPartialHeading = (partialText, level, caseSensitive) => {
  element(by.css(level || '.middle-container h1')).getText().then((text) => {
    text = caseSensitive ? text : text.toLowerCase();
    expect(text).toContain(partialText);
  });
};
