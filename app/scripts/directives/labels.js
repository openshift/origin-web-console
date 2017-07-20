'use strict';

angular.module('openshiftConsole')
  .directive('labels', function($location, $timeout, LabelFilter) {
    return {
      restrict: 'E',
      scope: {
        labels: '=',
        // if you specify clickable, then everything below is required unless specified as optional
        clickable: "@?",
        kind: "@?",
        projectName: "@?",
        limit: '=?',
        titleKind: '@?',   // optional, instead of putting kind into that part of the hover
                           // title, it will put this string instead, e.g. if you want 'builds for build config foo'
        navigateUrl: '@?',  // optional to override the default
        filterCurrentPage: '=?' //optional don't navigate, just filter here
      },
      templateUrl: 'views/directives/labels.html',
      link: function(scope) {
        scope.filterAndNavigate = function(key, value) {
          if (scope.kind && scope.projectName) {
            if (!scope.filterCurrentPage) {
              $location.url(scope.navigateUrl || ("/project/" + scope.projectName + "/browse/" + scope.kind));
            }
            $timeout(function() {
              var selector = {};
              selector[key] = value;
              LabelFilter.setLabelSelector(new LabelSelector(selector, true));
            }, 1);
          }
        };
      }
    };
  })
  .directive('labelEditor', function() {

    var LABEL_REGEXP = /^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?$/;
    var LABEL_MAXLENGTH = 63;
    var SUBDOMAIN_REGEXP = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
    var SUBDOMAIN_MAXLENGTH = 253;

    function validateSubdomain(str) {
      if (str.length > SUBDOMAIN_MAXLENGTH) { return false; }
      return SUBDOMAIN_REGEXP.test(str);
    }

    function validateLabel(str) {
      if (str.length > LABEL_MAXLENGTH) { return false; }
      return LABEL_REGEXP.test(str);
    }

    return {
      restrict: 'E',
      scope: {
        labels: "=",
        expand: "=?",
        canToggle: "=?",
        // Optional help text to show with the label controls
        helpText: "@?"
      },
      templateUrl: 'views/directives/label-editor.html',
      link: function(scope, element, attrs) {
        if (!angular.isDefined(attrs.canToggle)) {
          scope.canToggle = true;
        }
      },
      controller: [
        '$scope',
        function($scope) {

          // simulate a regex, object w/.test() method
          var labelValidator = {
            test: function(val) {
              var parts = val.split("/");
              switch(parts.length) {
                case 1:
                  return validateLabel(parts[0]);
                case 2:
                  return validateSubdomain(parts[0]) && validateLabel(parts[1]);
              }
              return false;
            }
          };

          angular.extend($scope, {
            validator: {
              key: labelValidator,
              value: labelValidator
            }
          });
        }
      ]
    };
  });
