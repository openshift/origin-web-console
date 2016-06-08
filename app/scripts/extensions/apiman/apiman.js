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
    uri.path('apimanui/api-manager/orgs/').segment(namespace).segment('apis').segment(name);
    return uri;
  }

  var _module = angular.module(pluginName, []);

  _module.controller('Apiman.LinkController', ['$scope', '$element', function ($scope, $element) {
    $scope.go = function() {
      var form = $element.find('form');
      form.submit();
    }
  }]);

  _module.run(['AuthService', 'BaseHref', 'DataService', 'extensionRegistry', '$sce', function(AuthService, BaseHref, DataService, extensionRegistry, $sce) {
    if (!APIMAN_URL) {
      return;
    }

    // This is the page we POST to first
    var linkUri = createApimanLinkUri();
    log.debug("apiman link: ", linkUri.toString());
    var link = $sce.trustAsResourceUrl(linkUri.toString());

    var template = `
      <div ng-controller="Apiman.LinkController">
        <form action="{{item.data.link}}" method="POST">
          <input type="hidden" name="redirect" value="{{item.data.redirect}}">
          <input type="hidden" name="access_token" value="{{item.data.accessToken}}">
        </form>
        <a href="" ng-click="go()">Manage API</a>
      </div>
    `;

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
      var redirect = createApimanPageUri(name, namespace)
                        .hash('#' + URI.encode('{"backTo": "' + new URI().toString()) + '"}')
                        .toString();
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
        node: template,
        data: data
      };
    })

    extensionRegistry.add('service-links', extension);
    extensionRegistry.add('service-menu', extension);

  }]);
})();
