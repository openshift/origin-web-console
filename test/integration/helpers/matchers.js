'use strict';

exports.expectAlert = function(msg) {
expect(element(by.css('.alert')).getText()).toEqual('error\n' + msg);
};

exports.expectHeading = function(heading) {
  expect(element(by.css('h1')).getText()).toEqual(heading);
};
