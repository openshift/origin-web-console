'use strict';

exports.nonAngular = function(func) {
  // kill the sync to prep for a drop into
  // raw webdriver calls. the browser sync is
  // how protractor knows to wait around for
  // angular
  browser.ignoreSynchronization = true;
  // func should be a wrapper around raw webdriver calls,
  // not protractor.  Therefore the following:
  // - will work:
  //   - browser.driver.findElement(by.css('.title')).getText();
  // - will not work:
  //   - element(by.css('.title')).getText();
  func();
  // set the sync back for tests that follow
  browser.ignoreSynchronization = false;
};
