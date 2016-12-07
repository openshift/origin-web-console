'use strict';

const Page = require('./page').Page;

class RoutesPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'project/' + this.project.name + '/browse/routes';
  }
}

exports.RoutesPage = RoutesPage;
