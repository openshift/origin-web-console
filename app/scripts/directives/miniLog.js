'use strict';

(function() {
  angular.module('openshiftConsole').component('miniLog', {
    controllerAs: 'miniLog',
    controller: [
      '$scope',
      '$filter',
      'APIService',
      'DataService',
      'DeploymentsService',
      'HTMLService',
      MiniLogController
    ],
    bindings: {
      apiObject: '<',
      numLines: '<',
      context: '<'
    },
    templateUrl: 'views/overview/_mini-log.html'
  });

  function MiniLogController($scope,
                             $filter,
                             APIService,
                             DataService,
                             DeploymentsService,
                             HTMLService) {
    var miniLog = this;

    var name, logSubresource, streamer;
    var numLines = miniLog.numLines || 7;
    var buffer = [];
    miniLog.lines = [];

    var update = _.throttle(function() {
      $scope.$evalAsync(function() {
        miniLog.lines = _.clone(buffer);
      });
    }, 200);

    // Used as a "track by" ID in the view. Since we follow from the end, might
    // not correspond to actual line numbers. Track by is necessary in case a
    // line is repeated.
    var lineNum = 0;
    var onMessage = function(msg) {
      if (!msg) {
        return;
      }

      var escaped = ansi_up.escape_for_html(msg);
      var html = ansi_up.ansi_to_html(escaped);
      var linkifiedHTML = HTMLService.linkify(html, '_blank', true);

      lineNum++;
      buffer.push({
        markup: linkifiedHTML,
        id: lineNum
      });

      if (buffer.length > numLines) {
        buffer = _.takeRight(buffer, numLines);
      }

      update();
    };

    var stopStreaming = function() {
      if (!streamer) {
        return;
      }

      streamer.stop();
      streamer = null;
    };

    var startStreaming = function() {
      var options = {
        follow: true,
        tailLines: numLines
      };

      streamer = DataService.createStream(logSubresource, name, miniLog.context, options);
      streamer.start();
      streamer.onMessage(onMessage);
      streamer.onClose(function() {
        streamer = null;
      });
    };

    miniLog.$onInit = function() {
      logSubresource = DeploymentsService.getLogResource(miniLog.apiObject);
      name = DeploymentsService.getName(miniLog.apiObject);
      startStreaming();
    };

    miniLog.$onDestroy = function() {
      stopStreaming();
    };
  }
})();
