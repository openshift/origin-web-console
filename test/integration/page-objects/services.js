'use strict';

const Page = require('./page').Page;

class ServicesPage extends Page {
  constructor(project, menus) {
    super(project, menus);
  }
  getUrl() {
    return 'project/' + this.project.name + '/browse/services';
  }
}

exports.ServicesPage = ServicesPage;
