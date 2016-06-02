'use strict';


var Input = function(elem) {
  this.elem = elem;
};

Input.prototype.setValue = function(value) {
  this.elem.clear();
  this.elem.sendKeys(value);
  // TODO: separate expect out into matcher
  expect(this.elem.getAttribute("value")).toBe(value);
};


exports.byModel = function(name) {
  var input = element(by.model(name));
  expect(input).toBeTruthy();
  return new Input(input);
};

exports.byCSS = function(selector) {
  var input = element(by.css(selector));
  expect(input).toBeTruthy();
  return new Input(input);
};
