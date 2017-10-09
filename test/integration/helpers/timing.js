'use strict';

module.exports = {
  // arbitrary wait, perhaps just for a render
  standardDelay: 500,
  // time to wait for initial Page.visit(), more bootstrapping, etc
  initialVisit: 1000,
  // implicit redirects do not cause browser.refresh()
  implicitRedirect: 500,
  // sufficient for menus.someNav.clickSomething()
  navToPage: 500,
  // sufficient for a show/hide delay for a UI element.
  // protractor may fail if an element is on page but hidden
  openMenu: 300,
  waitForElement: 500,
  maxWaitForElement: 15000
};
