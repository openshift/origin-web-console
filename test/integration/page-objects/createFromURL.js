'use strict';

const Page = require('./page').Page;
const logger = require('../helpers/logger');
const h = require('../helpers.js');

class CreateFromURLPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl(qs) {
    return 'create' + qs;
  }
  // TODO: for some reason, the Page.visit()'s use of helpers.goToPage()
  // does not work here, so we have to override.
  visit(qs) {
    this.qs = qs;
    logger.log('visiting url:', this.getUrl(this.qs));
    return browser.get('create' + this.qs);
  }
  clickCreateNewProjectTab() {
    return element(by.css('.nav-tabs')).isPresent()
      .then((result) => {
        if (result) {
          element.all(by.css('.nav-tabs > li > a')).last().click();
        }
      });
  }
  selectExistingProject(stringFragment, uri) {
    return element(by.css('.nav-tabs')).isPresent()
      .then((result) => {
        if (result) {
          // select project from the dropdown and click next
          element(by.model('selected.project')).click();
          element(by.css('.ui-select-search')).sendKeys(stringFragment).sendKeys(protractor.Key.ENTER);
          h.clickAndGo('Next', uri);
        }
      });
  }
  clickShowAdvanced() {
    return element(by.css('[ng-click="advancedOptions = !advancedOptions"]')).click();
  }
}

exports.CreateFromURLPage = CreateFromURLPage;
