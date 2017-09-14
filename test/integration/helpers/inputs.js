'use strict';


const setInputValue = (selector, value) => {
  var input = element(selector);
  input.clear();
  input.sendKeys(value);
  // do we want the expect here? it is helpful
  // for reporting out an error?
  expect(input.getAttribute("value")).toBe(value);
  return input;
};

// is a pain to get an array of input values because .getAttribute()
// is a promise
const getInputValues = (inputs) => {
  let allValues = protractor.promise.defer();
  let values = [];
  let count;
  inputs.count()
    .then((num) => {
      count = num + 1;
    });
  inputs.each((input, i) => {
    input
      .getAttribute('value')
      .then((val) => {
        values.push(val);
        if((i) === count) {
          allValues.fulfill(values);
        }
      });
  });
  return allValues.promise;
};

// inputs: protractor object
//  - element.all(by.model('parameter.value'))
// value: string
const findValueInInputs = (inputs, value) => {
  return getInputValues(inputs)
          .then((values) => {
            let found = values.find((val) => { val === value; });
            return found;
          });
};


// example:
//   check(element(by.css('input[type="checkbox"]')))
const check = (checkboxElem) => {
  return checkboxElem.isSelected().then((selected) => {
    if(!selected) {
      return checkboxElem.click();
    }
  });
};

// example:
//   unCheck(element(by.css('input[type="checkbox"]')))
const uncheck = (checkboxElem) => {
  return checkboxElem.isSelected().then((selected) => {
    if(selected) {
      return checkboxElem.click();
    }
  });
};

exports.setInputValue = setInputValue;
exports.getInputValues = getInputValues;
exports.findValueInInputs = findValueInInputs;

exports.check = check;
exports.uncheck = uncheck;
