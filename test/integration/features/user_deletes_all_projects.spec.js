'use strict';

const common = require('../helpers/common');
const ProjectListPage = require('../page-objects/projectList').ProjectListPage;

// this test is technically just a helper to fix problems
// when testing locally.  Run as:
// grunt test-integration --suite=delete-all-projects
describe('Authenticated user deletes all projects', () => {

  beforeAll(() => {
    common.beforeAll();
  });

  it('should delete each project one by one', () => {

    let projectList = new ProjectListPage();
    projectList.visit();

    projectList.deleteAllProjects();

    let tilesRemaining = element.all(by.css('.list-group-item.project-info'));

    tilesRemaining.count().then((num) => {
      expect(num).toEqual(0);
    });
  });
});
