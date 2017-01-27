'use strict';

const Page = require('./page').Page;

class DeploymentsPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'project/' + this.project.name + '/browse/deployments';
  }
}

exports.DeploymentsPage = DeploymentsPage;
