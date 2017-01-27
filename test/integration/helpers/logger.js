'use strict';

// Use logger functions in place of console to ensure that log messages are wrapped
// in a promise & resolved asyncronously.
// NOTE: even if you don't use .then(), the promise queue is still synchronized in protractor.
// This is handy, a bit weird.
//
// example:
// - bad:
//   console.log('Foo');
//   element(by.buttonText(buttonText)).click();  // Protractor fns are promises & queued!
//   console.log('Bar');                          // This console.log will run before the above resolves
// - good:
//   logger.log('Foo');                           // in Promise queue
//   element(by.buttonText(buttonText)).click();  // in Promise queue
//   logger.log('Bar');                           // in Promise queue yay! happens after above.
['log', 'info', 'warn', 'error'].forEach(function(logType) {
  exports[logType] = function() {
    var args = Array.prototype.slice.call(arguments);
    browser.sleep(0).then(function() {
      console[logType].apply(console, args);
    });
  };
});


// use to check the actual browser logs to see if there is a useful error
// can also browser.pause(), browser.sleep(longTime), browser.debugger()
exports.getBrowserLogs = function() {
  return browser.manage().logs().get('browser').then(function(browserLog) {
    exports.log('log: ' + require('util').inspect(browserLog));
  });
};
