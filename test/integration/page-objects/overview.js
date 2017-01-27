'use strict';

const h = require('../helpers');
const Page = require('./page').Page;

class OverviewPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'project/' + this.project.name + '/overview';
  }
  clickAddToProject() {
    let button = element(by.cssContainingText('.project-action-btn', 'Add to project'));
    h.waitForElem(button);
    button.click();
    // lazy load to avoid future circular dependencies
    let CatalogPage = require('./catalog').CatalogPage;
    return new CatalogPage(this.project);
  }
}

exports.OverviewPage = OverviewPage;
