'use strict';

const Page = require('./page').Page;

class CatalogPage extends Page {
  constructor() {
    super();
  }
  getUrl() {
    return '/';
  }
  clickServiceItemByName(name) {
    return element(by.cssContainingText('.services-item', name)).click();
  }
}


exports.CatalogPage = CatalogPage;
