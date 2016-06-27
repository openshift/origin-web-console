'use strict';

angular.module("openshiftConsole")
  .service("CachedTemplateService", function(){

    var template = null;
    return {
      setTemplate: function(temp) {
        template = temp;
      },
      getTemplate: function() {
        return template;
      },
      clearTemplate: function() {
        template = null;
      }
    };

  }).service("ProcessedParametersService", function(){

    var params = {
      all: [],
      generated: []
    };

    return {
      setParams: function(allParameters, generatedParametersName) {
        _.each(allParameters, function(param) {
          params.all.push({
            name: param.name,
            value: param.value
          });
        });
        _.each(generatedParametersName, function(param) {
          if (!param.value) {
            params.generated.push(param.name);
          }
        });
      },
      getParams: function() {
        return params;
      },
      clearParams: function() {
        params = {
          all: [],
          generated: []
        };
      }
    };
  });