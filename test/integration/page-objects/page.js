'use strict';

const h = require('../helpers');
const logger = require('../helpers/logger');
const defaultMenus = require('./menus');

class Page {
  constructor(project, menus) {
    this.project = project;
    this.menus = menus || defaultMenus;
  }
  getUrl() {

  }
  visit() {
    logger.log('visiting url:', this.getUrl());
    return h.goToPage(this.getUrl());
  }

}

exports.Page = Page;
