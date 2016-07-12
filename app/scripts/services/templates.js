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

  }).service("ProcessedTemplateService", function(){
    
    var cleanTemplateData = function() {
      return {
        params: {
          all: [],
          generated: []
        },
        message: null
      };
    };

    var templateData = cleanTemplateData();

    return {
      setTemplateData: function(allParameters, generatedParametersName, msg) {
        _.each(allParameters, function(param) {
          templateData.params.all.push({
            name: param.name,
            value: param.value
          });
        });
        _.each(generatedParametersName, function(param) {
          if (!param.value) {
            templateData.params.generated.push(param.name);
          }
        });
        if (msg) {
          templateData.message = msg;
        }
      },
      getTemplateData: function() {
        return templateData;
      },
      clearTemplateData: function() {
        templateData = cleanTemplateData();
      }
    };
  });