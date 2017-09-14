'use strict';

const timing = require('./timing');

exports.setSize = (height = 2024, width = 2048) => {
  browser.driver.manage().window().setSize(width, height);
};

exports.maximize = () => {
  return browser.driver.manage().window().maximize();
};


exports.clearStorage = () => {
  browser.executeScript('window.sessionStorage.clear();');
  browser.executeScript('window.localStorage.clear();');
};

// ex:
//  scroll.toBottom().then(() => { /* do work */  });
exports.scrollToBottom = () => {
  return browser
          .executeScript('window.scrollTo(0,document.body.scrollHeight);')
          .then(() => {
            // brief wait to ensure components come into view before
            // running the next selectors
            browser.sleep(timing.scroll);
          });
};

exports.scrollToTop = () => {
  return browser.executeScript('window.scrollTo(0,0);');
};

exports.scrollTo = (elem) => {
  return browser.actions().mouseMove(elem);
};

exports.scrollToElement = (elem) => {
  return browser.actions().mouseMove(elem).perform();
};
