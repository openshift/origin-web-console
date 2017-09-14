'use strict';

const wait = require('../helpers/wait');
const Page = require('./page').Page;

class ProjectList extends Page {
  constructor(project, menu) {
    super(project, menu);
  }
  getUrl() {
    return 'projects';
  }
  findProjectTiles() {
    return element.all(by.css('.list-group-item'));
  }
  findTileBy(projectName) {
    let elem = element(by.cssContainingText('.tile-target', projectName));
    wait.forElem(elem);
    return elem;
  }
  clickTileBy(projectName) {
    // This is an implicit redirect, which typically
    // returns an instance of the new page. It should
    // return  new Overview(relevantProject), but this
    // method doesn't currently take a full project object
    return this.findTileBy(projectName).click();
  }
}

exports.ProjectList = ProjectList;
