'use strict';
angular
 .module('openshiftConsole')
 .factory('HawtioExtension', [
   'extensionRegistry',
   function(extensionRegistry) {
     console.warn('HawtioExtension.add() has been deprecated.  Please migrate to angular-extension-registry https://github.com/openshift/angular-extension-registry');
     return {
       add: function(endpointName, domNodeGenerator) {
         extensionRegistry.add(endpointName, function(args) {
           return {
             type: 'dom',
             node: domNodeGenerator(args)
           };
         });
       }
     };
   }
 ]);
