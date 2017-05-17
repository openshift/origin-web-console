'use strict';

angular.module("openshiftConsole")
  .factory("OwnerReferencesService", function() {
    var getOwnerReferences = function(apiObject) {
      return _.get(apiObject, 'metadata.ownerReferences');
    };

    return {
      getOwnerReferences: getOwnerReferences,

      groupByControllerUID: function(apiObjects) {
        var objectsByControllerUID = {};
        _.each(apiObjects, function(apiObject) {
          var hasController = false;
          _.each(getOwnerReferences(apiObject), function(ownerRef) {
            if (ownerRef.controller) {
              hasController = true;
              objectsByControllerUID[ownerRef.uid] = objectsByControllerUID[ownerRef.uid] || [];
              objectsByControllerUID[ownerRef.uid].push(apiObject);
            }
          });

          if (!hasController) {
            objectsByControllerUID[''] = objectsByControllerUID[''] || [];
            objectsByControllerUID[''].push(apiObject);
          }
        });

        return objectsByControllerUID;
      },

      filterForController: function(apiObjects, controller) {
        var controllerUID = _.get(controller, 'metadata.uid');
        return _.filter(apiObjects, function(apiObject) {
          return _.some(getOwnerReferences(apiObject), {
            uid: controllerUID,
            controller: true
          });
        });
      }
    };
  });
