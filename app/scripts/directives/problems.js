'use strict';
/*jshint -W030 */

angular.module('openshiftConsole')
  .directive('problems', [
    '$timeout',
    '$filter',
    '$q',
    'APIService',
    'DataService',
    'KeywordService',
    function($timeout,
             $filter,
             $q,
             APIService,
             DataService,
             KeywordService) {

      return {
        restrict: 'AE',
        transclude: true,
        templateUrl: 'views/directives/problems.html',
        scope: {
          object: '=',
          context: '=',
          run: '=?'
        },
        controller: [
          '$scope',
          function($scope) {
            $scope.empty = true;

            // get API
            var logSubresource, name;
            if ($scope.object.kind === "ReplicationController") {
              logSubresource = "deploymentconfigs/log";
              name = $filter('annotation')($scope.object, 'deploymentConfig');
            }
            else {
              logSubresource = APIService.kindToResource($scope.object.kind) + "/log";
              name = $scope.object.metadata.name;
            }

            // ----------- Sorting -------------
            var sortedProblems = [];
            var currentID = _.get($scope, 'sortConfig.currentField.id');
            var defaultIsReversed = {
              lastTimestamp: true
            };
            var sortProblems = function() {
              var sortID = _.get($scope, 'sortConfig.currentField.id', 'lastTimestamp');
              // only change if sort dropdown field is changed
              if (currentID !== sortID) {
                // set currentID to sortID
                currentID = sortID;
                // reverse the sort
                $scope.sortConfig.isAscending = !(defaultIsReversed[currentID]);
              }
              var order = $scope.sortConfig.isAscending ? 'asc' : 'desc';
              sortedProblems = _.orderBy($scope.problems, [sortID, 'metadata.resourceVersion'], [order, order]);
            };
            // ----------- End sorting -------------

            // ------------ Filtering -----------------
            var filterExpressions = [];

            var updateKeywords = function() {
              $scope.filterExpressions = filterExpressions = KeywordService.generateKeywords(_.get($scope, 'filter.text'));
            };

            // Only filter by keyword on certain fields.
            var filterFields = [
              'reason',
              'message',
              'count'
            ];

            var filterForKeyword = function() {
              $scope.filteredProblems = KeywordService.filterForKeywords(sortedProblems, filterFields, filterExpressions);
            };

            $scope.$watch('filter.text', _.debounce(function() {
              updateKeywords();
              $scope.$evalAsync(filterForKeyword);
            }, 50, { maxWait: 250 }));
            // --------------- End Filtering ---------------

            // STREAMER

            var update = _.debounce(function() {
                sortProblems();
                filterForKeyword();
            }, 100, { maxWait: 300 });


            // maintaining one streamer reference & ensuring its closed before we open a new,
            // since the user can (potentially) swap between multiple containers
            var streamer;
            var stopStreaming = function(keepContent) {
              var deferred = $q.defer();
              if (streamer) {
                streamer.onClose(function() {
                  deferred.resolve();
                });
                streamer.stop();
              } else {
                // Resolve immediately if no active stream.
                deferred.resolve();
              }

              if (!keepContent) {
                update.cancel();
              }

              return deferred.promise;
            };

            var areSimilar = function(s1, s2){
                // TODO - implement Levenshtein distance
                var failed = 0;
                var blocks_full = s1.split('\n');
                var blocks = [];
                for (var i = 0; i < blocks_full.length; i++){
                    var middle = Math.floor(blocks_full[i].length / 2);
                    blocks.push(blocks_full[i].substring(0, middle));
                    blocks.push(blocks_full[i].substring(middle));
                }
                for (var j = 0; j < blocks.length; j++) {
                    if (s2.indexOf(blocks[j]) === -1){
                        failed++;
                    }
                }
                if (failed > Math.ceil(blocks.length*0.2)){
                    return false;
                }
                return true;
            };

            var streamLogs = function() {
              // Stop any active streamer.
              stopStreaming().then(function() {
                $scope.$evalAsync(function() {
                  if(!$scope.run) {
                    return;
                  }

                  angular.extend($scope, {
                    loading: true,
                    state: ''
                  });

                  streamer = DataService.createStream(logSubresource, name, $scope.context);
                  var addLine = function(text) {
                    var msg = text.slice("container-exception-logger - ".length);
                    try {
                        msg = JSON.parse(msg);
                    } catch(err){
                        console.log(err);
                        return;
                    }

                    // Deduplicate
                    var milis = Number(msg.time)*1000;
                    var duplicate = false;
                    for (var i = 0; i < $scope.problems.length; i++){
                        if(areSimilar($scope.problems[i].backtrace, msg.backtrace)){
                            duplicate = true;
                            $scope.problems[i].count++;
                            if ($scope.problems[i].lastTimestamp.getTime() < milis){
                                $scope.problems[i].lastTimestamp = new Date(milis);
                            }
                            break;
                        }
                    }
                    if (duplicate) {
                      return;
                    }
                    $scope.problems.push(
                      {
                        lastTimestamp: new Date(milis),
                        reason: msg.reason,
                        message: 'Problem in ' + msg.executable + ' occurred',
                        count: 1,
                        backtrace: msg.backtrace
                    });
                    update();
                  };

                  streamer.onMessage(function(msg) {
                    // ensures the digest loop will catch the state change.
                    $scope.$evalAsync(function() {
                      $scope.empty = false;
                      if($scope.state !== 'logs') {
                        $scope.state = 'logs';
                      }
                    });

                    // Completely empty messages (without even a newline character) should not add lines
                    if (!msg) {
                      return;
                    }

                    if (! msg.startsWith('container-exception-logger')){
                      return;
                    }

                    addLine(msg);
                  });

                  streamer.onClose(function() {
                    streamer = null;
                    $scope.$evalAsync(function() {
                      $scope.loading = false;
                    });
                  });

                  streamer.onError(function() {
                    streamer = null;
                    $scope.$evalAsync(function() {
                      angular.extend($scope, {
                        loading: false,
                      });
                      // TODO - some problems may be archived - see kibana in logview
                    });
                  });

                  streamer.start();
                });
              });
            };

            // PUBLIC API ----------------------------------------------------

            this.start = function() {
            };

            angular.extend($scope, {
              ready: true,
              loading: true,
              state: false,
            });


            $scope.$on('$destroy', function() {
              stopStreaming();
            });


            // decide whether we should request the logs ------------------------
            if (logSubresource === 'deploymentconfigs/logs' && !name) {
              $scope.state = 'empty';
              $scope.emptyStateMessage = 'Logs are not available for this replication controller because it was not generated from a deployment configuration.';
              // don't even attempt to continue since we can't fetch the logs for these RCs
              return;
            }

            $scope.$watchGroup(['name', 'options.container', 'run'], streamLogs);

            $scope.filter = {
              text: ''
            };

            $scope.problems = [];

            $scope.sortConfig = {
              fields: [{
                id: 'lastTimestamp',
                title: 'Time',
                sortType: 'alpha'
              }, {
                id: 'reason',
                title: 'Reason',
                sortType: 'alpha'
              }, {
                id: 'message',
                title: 'Message',
                sortType: 'alpha'
              }, {
                id: 'count',
                title: 'Count',
                sortType: 'numeric'
              }],
              isAscending: true,
              onSortChange: update
            };

            // Accordion table
            $scope.showDropdown = function($event) {
                var element = angular.element($event.currentTarget);
                if (element.attr('class').indexOf("open") === -1){
                    element.addClass("open");
                }
                else {
                    element.removeClass("open");
                }
            };
          }
        ],
        require: 'problems',
      };
    }
  ]);
