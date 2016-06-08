(function() {

  var pluginName = 'apimanLinks';
  var log = Logger.get(pluginName);

  var APIMANAGER_ANNOTATION = 'api.service.openshift.io/api-manager';
  var APIMAN = 'apiman';

  var APIMAN_URL = undefined;

  hawtioPluginLoader.addModule(pluginName);

  hawtioPluginLoader.registerPreBootstrapTask(function(next) {
    // TODO need to figure out apiman service discovery
    APIMAN_URL = 'https://apiman.vagrant.f8';
    next();
  });

  function createApimanLinkUri() {
    var uri = new URI(APIMAN_URL).path('apimanui/link');
    return uri;
  }

  function createApimanPageUri(name, namespace) {
    var uri = new URI(APIMAN_URL);
    uri.path('apimanui/api-manager/');
    if (name && namespace) {
      uri.segment('orgs/').segment(namespace).segment('apis').segment(name);
    }
    return uri;
  }

  function createRedirectLink(name, namespace) {
    var redirect = createApimanPageUri(name, namespace)
      .hash('#' + URI.encode('{"backTo": "' + new URI().toString()) + '"}');
    return redirect;
  }

  var _module = angular.module(pluginName, []);

  // Controller used to set the form data for the link in the main navigation
  _module.controller('Apiman.MainLinkController', ['$scope', '$sce', 'AuthService', function($scope, $sce, AuthService) {
    $scope.item = {
      data: {
        link: $sce.trustAsResourceUrl(createApimanLinkUri().toString()),
        redirect: $sce.trustAsResourceUrl(createRedirectLink().toString()),
        accessToken: AuthService.UserStore().getToken()
      }
    };
  }]);

  // Controller that handles submitting the form when the user clicks on the apiman link
  _module.controller('Apiman.LinkController', ['$scope', '$element', function ($scope, $element) {
    $scope.go = function() {
      var form = $element.find('form');
      form.submit();
    }
  }]);

  _module.run(['AuthService', 'BaseHref', 'DataService', 'extensionRegistry', '$sce', 'HawtioNav', '$templateCache', function(AuthService, BaseHref, DataService, extensionRegistry, $sce, nav, $templateCache) {
    if (!APIMAN_URL) {
      return;
    }
    // main nav item template
    $templateCache.put('apimanMainLink.html', `
      <sidebar-nav-item ng-controller="Apiman.MainLinkController" ng-include="'apimanLink.html'"></sidebar-nav-item>
    `);
    // link form template
    $templateCache.put('apimanLink.html', `
      <div ng-controller="Apiman.LinkController">
        <form action="{{item.data.link}}" method="POST">
          <input type="hidden" name="redirect" value="{{item.data.redirect}}">
          <input type="hidden" name="access_token" value="{{item.data.accessToken}}">
        </form>
        <a href="" ng-click="go()">Manage API</a>
      </div>
    `);
    // set up the main nav item and add it
    var builder = nav.builder();
    var tab = builder.id('apiman-main-link')
      .href(function() { return ''; })
      .title(function() { return 'Manage API'; })
      .template(function() { return $templateCache.get('apimanMainLink.html'); })
      .isValid(function() { return true })
      .build();
    tab.icon = "puzzle-piece";
    nav.add(tab);

    // This is the page we POST to first
    var linkUri = createApimanLinkUri();
    log.debug("apiman link: ", linkUri.toString());
    var link = $sce.trustAsResourceUrl(linkUri.toString());

    // sets up the data used by the form based on the k8s service
    function configureData(service) {
      if (!service.metadata.annotations) {
        return;
      }
      var annotation = service.metadata.annotations[APIMANAGER_ANNOTATION];
      if (!annotation || annotation !== APIMAN) {
        return;
      }
      var name = service.metadata.name;
      var namespace = service.metadata.namespace;
      var redirect = createRedirectLink(name, namespace).toString()
      log.debug("target apiman page: ", redirect);
      var token = AuthService.UserStore().getToken();
      return {
        link: link,
        redirect: $sce.trustAsResourceUrl(redirect),
        accessToken: token
      }
    }

    var extension = _.spread(function(service) {
      var data = configureData(service);
      if (!data) {
        return;
      }
      return {
        type: 'dom',
        node: $templateCache.get('apimanLink.html'),
        data: data
      };
    })

    extensionRegistry.add('service-links', extension);
    extensionRegistry.add('service-menu', extension);

  }]);
})();
