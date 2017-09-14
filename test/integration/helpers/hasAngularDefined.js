'use strict';



// usage:
// somePage.visit();
// waitForRedirect(somePage.getUrl());
// expect(somethingAfterRedirect).toBe(thisOrThat);
exports.waitForRedirect = function(urlFragment, timeout) {
  let hasRedirected = false;
  browser.wait(() => {
    browser
      .getCurrentUrl()
      .then((url) => {
        return url.includes(urlFragment);
      })
      .then((hasNavigated) => {
        hasRedirected = hasNavigated;
      });
    return hasRedirected;
  }, timeout || 5000);
};
