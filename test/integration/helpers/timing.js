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
  scroll: 100,
  // ex:
  //   let until = protractor.ExpectedConditions.until;
  //   browser.wait(
  //    until.presenceOf(elem),
  //    timing.waitForElement,
  //    'Elem did not appear')
  waitForElement: 1000,
  maxWaitForElement: 15 * 1000,
  pauseBetweenTests: 5 * 1000,
  // longer timeouts for non-angular page interactions
  // since we won't have protractor helping us
  shortDelay: 1000,
  medDelay: 3000,
  longDelay: 5000,
  xtraLongDelay: 10000
};
