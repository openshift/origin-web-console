'use strict';

// should externalize user?
var user = require('../helpers/user.js');
var driver = browser.driver;

// exports.login = function(loginPageAlreadyLoaded) {
//   // The login page doesn't use angular, so we have to use the underlying WebDriver instance
//   var driver = browser.driver;
//   if (!loginPageAlreadyLoaded) {
//     browser.get('/');
//     driver.wait(function() {
//       return driver.isElementPresent(by.name("username"));
//     }, 3000);
//   }
//
//   driver.findElement(by.name("username")).sendKeys("e2e-user");
//   driver.findElement(by.name("password")).sendKeys("e2e-user");
//   driver.findElement(by.css("button[type='submit']")).click();
//
//   driver.wait(function() {
//     return driver.isElementPresent(by.css(".navbar-iconic .username"));
//   }, 5000);
// };

// reworking old .login() fn to .visit() as you can
// visit the login page like the other pages.
exports.visit = function() {
  //return browse.goTo('/project/' + project.name + '/browse/images');
  return browser.driver.get('/');
};

// since the login page doesn't use angular, need to
// use the driver for this stuff rather than the helpers/input.js helper
exports.login = function() {

  driver.findElement(by.name("username")).sendKeys("e2e-user");
  driver.findElement(by.name("password")).sendKeys("e2e-user");
  driver.findElement(by.css("button[type='submit']")).click();

  driver.wait(function() {
    return driver.isElementPresent(by.css(".navbar-iconic .username"));
  }, 5000);
}
