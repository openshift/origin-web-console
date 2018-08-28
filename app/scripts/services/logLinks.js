'use strict';

angular.module('openshiftConsole')
  .factory('logLinks', function($anchorScroll, $document, $location, $window) {
      // TODO (bpeterse): a lot of these functions are generic and could be moved/renamed to
      // a navigation oriented service.


      var scrollTop = function(node) {
        if(!node) {
          window.scrollTo(null, 0);
        } else {
          node.scrollTop = 0;
        }
      };


      var scrollBottom = function(node) {
        if(!node) {
          window.scrollTo(0, document.documentElement.scrollHeight - document.documentElement.clientHeight);
        } else {
          node.scrollTop = node.scrollHeight;
        }
      };


      // new tab: path/to/current?view=chromeless
      var chromelessLink = function(options, fullLogURL) {
        if (fullLogURL) {
          $window.open(fullLogURL, '_blank');
          return;
        }
        var params = {
          view: 'chromeless'
        };
        if (options && options.container) {
          params.container = options.container;
        }
        params = _.flatten([params]);
        var uri = new URI();
        _.each(params, function(param) {
          uri.addSearch(param);
        });
        $window.open(uri.toString(), '_blank');
      };

      // broken up for readability:
      var template = _.template([
        "/#/discover?",
        "_g=(",
          "time:(",
            "from:now-1w,",
            "mode:relative,",
            "to:now",
          ")",
        ")",
        "&_a=(",
          //"columns:!(_source),",
          "columns:!(kubernetes.container_name,message),",
          "index:'<%= index %>',",
          "query:(",
            "query_string:(",
              "analyze_wildcard:!t,",
              "query:'kubernetes.pod_name:\"<%= podname %>\" AND kubernetes.namespace_name:\"<%= namespace %>\"'",
            ")",
          "),",
          "sort:!('@timestamp',desc)",
        ")",
        // NOTE: slightly older versions of kibana require openshift_ prefix, not console_
        "#console_container_name=<%= containername %>",
        // backlink should be encoded.  passing URI.encode(backlink) should be sufficient
        "&console_back_url=<%= backlink %>"
      ].join(''));


      var archiveUri = function(opts, prefix) {
        prefix = prefix || 'project.' + opts.namespace + '.' + opts.namespaceUid;
        opts.index = prefix + '.*';
        return template(opts);
      };

      return {
        scrollTop: scrollTop,
        scrollBottom: scrollBottom,
        chromelessLink: chromelessLink,
        archiveUri: archiveUri
      };
    }
  );
