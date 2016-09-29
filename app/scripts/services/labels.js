'use strict';

angular.module("openshiftConsole")
  .factory("LabelsService", function() {
    var getTemplateLabels = function(object) {
      return _.get(object, 'spec.template.metadata.labels', {});
    };

    return {
      // Group objects using label selectors (e.g., pods by service or replica
      // sets by deployment). Returns a map of owners to objects. The key is
      // the owner name (unless `opts.key` is set). The value is a collection
      // of objects. Owners must have a `spec.selector` property.
      //
      // `opts.matchTemplate` will match object's `spec.template.metadata.labels`
      // instead of `metadata.labels`.
      //
      // `opts.key` is an optional property from the owner to use as the map
      // key. Defaults to `metadata.name`.
      //
      // `opts.include` is an optional filter function to only include certain
      // objects in the map.
      groupBySelector: function(objects, owners, opts) {
        var objectsByOwner = {}, selectors = {};
        opts = opts || {};

        // Build a map of selectors by owner UID.
        _.each(owners, function(owner) {
          selectors[owner.metadata.uid] = new LabelSelector(owner.spec.selector);
        });

        // Find matching owners for each object.
        _.each(objects, function(object) {
          if (opts.include && !opts.include(object)) {
            return;
          }

          var matchingOwners = _.filter(owners, function(owner) {
            var ownerSelector = selectors[owner.metadata.uid];
            if (!opts.matchTemplate) {
              return ownerSelector.matches(object);
            }

            var objectSelector = new LabelSelector(getTemplateLabels(object));
            return ownerSelector.covers(objectSelector);
          });

          // Use an empty key if no owners match.
          if (!matchingOwners.length) {
            _.set(objectsByOwner, ['', object.metadata.name], object);
          }

          _.each(matchingOwners, function(owner) {
            var key = _.get(owner, opts.key || 'metadata.name', '');
            _.set(objectsByOwner, [key, object.metadata.name], object);
          });
        });

        return objectsByOwner;
      }
    };
  });
