'use strict';

const h = require('../helpers.js');

// takes a protractor element representing a table & returns a list of
// names found in the first td of each row
exports.getNames = (elem) => {
  h.waitForElem(elem);
  return elem.all(by.tagName('tr')).map((tableRow) => {
    return tableRow.element(by.css('td[data-title="Name"]'))
            .getText().then((text) => {
              return text;
            });
  });
};

// takes a protractor element representing a table & returns a row count
exports.countRows = (elem) => {
  return elem.all(by.css('tr')).count().then((numRows) => {
    return numRows;
  });
};
