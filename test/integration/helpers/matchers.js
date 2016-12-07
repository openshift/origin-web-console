'use strict';

exports.expectAlert = function(msg) {
expect(element(by.css('.alert')).getText()).toEqual('error\n' + msg);
};

exports.expectHeading = function(text, level) {
  expect(element(by.css(level || 'h1')).getText()).toEqual(text);
};

exports.expectPartialHeading = function(partialText, level, caseSensitive) {
  element(by.css(level || 'h1')).getText().then(function(text) {
    text = caseSensitive ? text : text.toLowerCase();
    expect(text).toContain(partialText);
  });
};
