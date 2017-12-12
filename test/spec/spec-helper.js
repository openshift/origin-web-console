"use strict";
beforeEach(module(function ($provide) {
  $provide.factory("HawtioExtension", function() {
    return {
      add: function() {}
    };
  });

}));

// Make sure a base location exists in the generated test html
 if (!$('head base').length) {
   $('head').append($('<base href="/">'));
 }

 angular.module('openshiftConsole').config(function(AuthServiceProvider) {
   AuthServiceProvider.UserStore('MemoryUserStore');
 });

 //load the module
beforeEach(module('openshiftConsole'));

// Load the precompiled templates
beforeEach(module('openshiftConsoleTemplates'));
