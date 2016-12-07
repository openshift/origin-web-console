'use strict';

const Page = require('./page').Page;

class BuildsPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'project/' + this.project.name + '/browse/builds';
  }
}

exports.BuildsPage = BuildsPage;
