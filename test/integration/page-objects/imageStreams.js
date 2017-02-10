'use strict';

const Page = require('./page').Page;

class ImageStreamsPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'project/' + this.project.name + '/browse/images';
  }
}

exports.ImageStreamsPage = ImageStreamsPage;
