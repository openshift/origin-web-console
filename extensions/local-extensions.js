/*
 * This is an empty extensions script file. Extensions scripts are loaded by
 * the Web Console when set in webconsole-config config map in the
 * openshift-web-console namespace. For example,
 *
 * extensions:
 *  scriptURLs:
 *   - "https://example.com/scripts/customizeBanner.js"
 *   - "https://example.com/scripts/customizeNav.js"
 *
 * You can modify this file to test extensions in a development environment.
 */

// the console is currently build with AngularJS (1.5.x)
// so in order to add custom code, we need to declare a module
angular.module(
  // name the module something that doesn't conflict
  'openshiftCustomPagesPrototype',
  // this array declares dependencies. the
  // web console itself will be our dependency
  ['openshiftConsole']
  )
  // angular provides a .config() function to do setup before the
  // app runs. this is where we can add additional routes
  .config([
    '$routeProvider',
    function($routeProvider) {
      $routeProvider
        // add a route, with :token tokens for params
        .when('/project/:project/some/string', {
            // you can inline a page template, but thats pretty messy
            // template: '<div> Some String </div>'
            // better to make a file
            templateUrl: 'extensions/_some_string.html',
            // and a controller for the page.
            // we will define this controller below
            controller: 'SomeController'
        });
    }
  ])
  // to create a page, you'll need a handful of services
  .controller('SomeController', [
    '$routeParams',
    '$scope',
    'APIService',
    'DataService',
    'ProjectsService',
    function(
      $routeParams,
      $scope,
      APIService,
      DataService,
      ProjectsService) {
      console.log('Some Controller...');

      // we have a preferred version for most resources
      var podsVersion = APIService.getPreferredVersion('pods');

      var watches  = [];

      // before doing other work, need to get the project context
      ProjectsService
        .get($routeParams.project)
        .then(_.spread(function(project, context) {

          // now we can request other things, such as pods
          watches.push(DataService.watch(podsVersion, context, function(pods) {
            // anything added to $scope gets sent to the template
            $scope.pods = pods.by('metadata.name');

          }));

          // add more watches.

          // this ensures you clean up when the page is destroyed & avoid memory leaks
          $scope.$on('$destroy', function(){
            DataService.unwatchAll(watches);
          });

        }));

    }
  ])
  // then angular provides a "run" function to run arbitrary code
  // after the app bootstraps.
  .run([
    // we will need to use the extension registry for the console
    // to inject custom code into the page.  This is AngularJS
    // dependency injection syntax
    'extensionRegistry',
    function(extensionRegistry) {

      // at this point we are set to provide some customizations
      // via the extension registry.  Some of the .add() location targets
      // throughout the console are:
      //     nav-help-dropdown - adds links to the help "?" dropdown in the top nav
      //     nav-system-status - adds links to a system status area in the top nav
      //     container-links - adds links to the containers block under configuration
      //       tabs in deployment pages
      // there are a few more, you can find them via a grep command in the root directory
      // of the origin-web-console repo:
      //  grep -ri extension-point app/views/
      extensionRegistry
        // this example will add a link to the help dropdown
        .add('nav-help-dropdown', function() {
          return [{
            type: 'dom',
            node: [
              '<li>',
                '<a href="#">',
                  'Custom link',
                '</a>',
              '</li>'
            ].join('')
          }]
        });

    }]);


// finally, this plugin loader will ensure that our custom code is
// loaded into the page at the appropriate time
hawtioPluginLoader.addModule('openshiftCustomPagesPrototype');
