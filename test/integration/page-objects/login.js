'use strict';

const environment = require('../environment');
const nonAngular = require('../helpers/nonAngular').nonAngular;
const timing = require('../helpers/timing');
const logger = require('../helpers/logger');

const webdriver = require('selenium-webdriver');
const until = webdriver.until;

// login page is a non-angular page
class LoginPage   {
  constructor() {
    // don't call super, this is a non-angular page
  }
  // the login flow is performed against a non-angular page.
  // therefore ignoreSyncronization is built in, as well as
  // plentiful timeouts to ensure we wait for angular to
  // bootstrap after the redirect before protractor picks up
  // and continues with the rest of the testing flows.
  login() {
    logger.log('login: Begin login flow');
    logger.log('login: Disabling Angular syncronization');
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);

    logger.log('login: Visit', environment.baseUrl);
    browser.driver.get(environment.baseUrl);
    browser.driver.sleep(timing.shortDelay);

    logger.log('login: Locating inputs on page');
    var usernameLocator = by.name('username');
    var passwordLocator = by.name('password');
    var userNameInput = browser.driver.findElement(usernameLocator);
    var passwordInput = browser.driver.findElement(passwordLocator);
    var submitButton = browser.driver.findElement(by.css("button[type='submit']"));
    browser.driver.wait(until.elementLocated(usernameLocator));
    browser.driver.wait(until.elementLocated(passwordLocator));
    browser.driver.sleep(timing.shortDelay);

    logger.log('login: Entering input values');
    userNameInput.sendKeys('e2e-user');
    passwordInput.sendKeys('e2e-user');

    logger.log('login: Submitting login form');
    submitButton.click();

    logger.log('login: Waiting for redirect');
    browser.driver.sleep(timing.medDelay);

    logger.log('login: Restoring Angular syncronization');
    browser.ignoreSynchronization = true;
    browser.waitForAngularEnabled(false);
    browser.driver.sleep(timing.shortDelay);

    logger.log('login: End login flow');
  }
}

exports.LoginPage = LoginPage;
