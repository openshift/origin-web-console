'use strict';

const environment = require('../environment');
const nonAngular = require('../helpers/nonAngular').nonAngular;

// login page is a non-angular page
class LoginPage   {
  constructor() {
    // don't call super, this is a non-angular page
  }
  // its just convenient to roll everything up
  // in one method for this page.
  login() {
    browser.driver.sleep(0).then(() => {
      browser.driver.get(environment.baseUrl);
      browser.driver.sleep(1000).then(() => {
        nonAngular(() => {
          browser.driver.wait(browser.driver.findElement(by.name('username'))).then(() => {
            browser.driver.findElement(by.name('username')).sendKeys('e2e-user');
            browser.driver.findElement(by.name('password')).sendKeys('e2e-user');
            browser.driver.findElement(by.css("button[type='submit']")).click();
          }, 1000);
        });
      });

    });
  }
}

exports.LoginPage = LoginPage;
