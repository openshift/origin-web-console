'use strict';

// is a pain to get an array of input values because .getAttribute()
// is a promise
var getInputValues = function(inputs) {
  var allValues = protractor.promise.defer();
  var values = [];
  var count;
  inputs
    .count()
    .then(function(num) {
      count = num;
    });
  inputs.each(function(input, i) {
    input
      .getAttribute('value')
      .then(function(val) {
        values.push(val);
        if((i+1) === count) {
          allValues.fulfill(values);
        }
      });
  });
  return allValues.promise;
};


// inputs: protractor object
//  - element.all(by.model('parameter.value'))
// value: string
var findValueInInputs = function(inputs, value) {
  return getInputValues(inputs)
          .then(function(values) {
            var found = values.find(function(val) {
              return val === value;
            });
            return found;
          });
};


exports.getInputValues = getInputValues;
exports.findValueInInputs = findValueInInputs;
