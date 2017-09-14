'use strict';

// FIXME: this was handy, but something has changed in the API.
// Need to come back and fix once the tests run again.
exports.setSize = (/*height = 2024, width = 2048*/) => {
  console.log('skipping window.setSize()...');
  // return browser.driver.manage().window().setSize(height, width);
  // hacking around with solutions:
  // browser.driver.executeScript(function(height, width) {
  //     return {
  //         width: width || window.screen.availWidth,
  //         height: height || window.screen.availHeight
  //     };
  // }, height, width).then(function(result) {
  //     browser.driver.manage().window().setSize(result.width, result.height);
  // });
};

exports.maximize = () => {
  console.log('skipping window.maximize()...');
  return browser.driver.manage().window().maximize();
};


exports.clearStorage = () => {
  browser.executeScript('window.sessionStorage.clear();');
  browser.executeScript('window.localStorage.clear();');
};

// example:
//  scroll.toBottom().then(function() { /* do work */  });
exports.scrollToBottom = () => {
  return browser
          .executeScript('window.scrollTo(0,document.body.scrollHeight);')
          .then(() => {
            // brief wait to ensure components come into view before
            // running the next selectors
            browser.sleep(500);
          });
};

exports.scrollToTop = () => {
  return browser.executeScript('window.scrollTo(0,0);');
};

exports.scrollTo = (elem) => {
  return browser.actions().mouseMove(elem);
};
// TODO: elminiate, not sure if 'perform'matters...
exports.scrollToElement = (elem) => {
  return browser.actions().mouseMove(elem).perform();
};
