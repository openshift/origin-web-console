'use strict';

const forms = require('../helpers/forms');
const timing = require('../helpers/timing');
const Page = require('./page').Page;
const ProjectListPage = require('./projectList').ProjectListPage;

class CreateProjectPage extends Page {
  constructor(project, menu) {
    super(project, menu);
  }

  getUrl() {
    return 'create-project';
  }

  createProject() {
    return forms.submitNewProjectForm(this.project).then(() => {
      return browser.sleep(timing.implicitRedirect).then(() => {
        return new ProjectListPage();
      });
    });
  }
}

exports.CreateProjectPage = CreateProjectPage;
